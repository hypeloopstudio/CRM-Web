import { NextResponse } from "next/server"
import { getFlowPaymentStatus } from "@/lib/flow"
import { sendOrderConfirmationEmail } from "@/lib/actions/shop"
import prisma from "@/lib/prisma"

// Umbral para considerar cliente como "Alto Ticket" (top 20% aproximado)
const ALTO_TICKET_THRESHOLD = 100000 // $100.000 CLP

export async function POST(request: Request) {
  console.log("📥 Webhook Flow recibido")
  
  try {
    const formData = await request.formData()
    const token = formData.get("token") as string

    console.log("Token recibido:", token)

    if (!token) {
      console.error("❌ Token no proporcionado")
      return new NextResponse("OK", { status: 200 })
    }

    // Obtener estado del pago desde Flow
    const paymentStatus = await getFlowPaymentStatus(token)
    console.log("Estado del pago:", paymentStatus)

    // Status 2 = Pagado exitosamente
    if (paymentStatus.status === 2) {
      console.log("✅ Pago confirmado, procesando pedido:", paymentStatus.commerceOrder)

      // Buscar el pedido
      const pedido = await prisma.pedido.findFirst({
        where: { id: paymentStatus.commerceOrder },
        include: {
          cliente: true,
          items: {
            include: {
              producto: true,
            },
          },
        },
      })

      if (pedido) {
        // 1. Actualizar estado del pedido a CONFIRMADO
        await prisma.pedido.update({
          where: { id: pedido.id },
          data: {
            estado: "PROCESANDO",
          },
        })
        console.log("📦 Pedido actualizado a PROCESANDO")

        // 2. Descontar stock de cada producto
        for (const item of pedido.items) {
          if (item.producto) {
            const nuevoStock = Math.max(0, item.producto.stock - item.cantidad)
            await prisma.producto.update({
              where: { id: item.producto.id },
              data: { stock: nuevoStock },
            })
            console.log(`📉 Stock actualizado: ${item.producto.nombre} (${item.producto.stock} -> ${nuevoStock})`)
          }
        }

        // 3. Actualizar segmento del cliente
        if (pedido.cliente) {
          // Calcular total gastado por el cliente
          const totalGastado = await prisma.pedido.aggregate({
            where: {
              clienteId: pedido.cliente.id,
              estado: { in: ["PROCESANDO", "ENVIADO", "ENTREGADO"] },
            },
            _sum: { total: true },
          })

          const gastoTotal = (totalGastado._sum.total || 0) + pedido.total

          // Determinar nuevo segmento
          let nuevoSegmento = pedido.cliente.segmento

          if (gastoTotal >= ALTO_TICKET_THRESHOLD) {
            nuevoSegmento = "ALTO_TICKET"
          } else {
            // Contar pedidos confirmados del cliente
            const pedidosCount = await prisma.pedido.count({
              where: {
                clienteId: pedido.cliente.id,
                estado: { in: ["PROCESANDO", "ENVIADO", "ENTREGADO"] },
              },
            })

            if (pedidosCount >= 3) {
              nuevoSegmento = "FRECUENTE"
            }
          }

          // Actualizar cliente
          await prisma.cliente.update({
            where: { id: pedido.cliente.id },
            data: {
              segmento: nuevoSegmento,
              totalGastado: gastoTotal,
            },
          })
          console.log(`👤 Cliente actualizado: segmento=${nuevoSegmento}, totalGastado=${gastoTotal}`)
        }

        // 4. Enviar email de confirmación
        console.log("📧 Enviando email de confirmación...")
        const emailResult = await sendOrderConfirmationEmail(pedido.id)
        if (emailResult.success) {
          console.log("✅ Email enviado exitosamente")
        } else {
          console.error("⚠️ Error enviando email:", emailResult.error)
        }

        console.log("✅ Procesamiento completo del pedido")
      } else {
        console.error("❌ Pedido no encontrado:", paymentStatus.commerceOrder)
      }
    } else {
      console.log("⚠️ Pago no confirmado, status:", paymentStatus.status)
    }

    // Flow SIEMPRE espera status 200
    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("❌ Error en webhook Flow:", error)
    // Siempre retornar 200 para que Flow no reintente
    return new NextResponse("OK", { status: 200 })
  }
}

// También manejar GET para verificación
export async function GET() {
  return new NextResponse("Webhook Flow activo", { status: 200 })
}
