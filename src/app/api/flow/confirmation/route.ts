import { NextResponse } from "next/server"

// Forzar que sea completamente dinámico
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

// Umbral para considerar cliente como "Alto Ticket"
const ALTO_TICKET_THRESHOLD = 100000

export async function POST(request: Request) {
  // Imports dinámicos dentro de la función
  const { getFlowPaymentStatus } = await import("@/lib/flow")
  const { sendOrderConfirmationEmail } = await import("@/lib/actions/shop")
  const { default: prisma } = await import("@/lib/prisma")
  
  console.log("📥 Webhook Flow recibido")
  
  try {
    const formData = await request.formData()
    const token = formData.get("token") as string

    console.log("Token recibido:", token)

    if (!token) {
      console.error("❌ Token no proporcionado")
      return new NextResponse("OK", { status: 200 })
    }

    const paymentStatus = await getFlowPaymentStatus(token)
    console.log("Estado del pago:", paymentStatus)

    if (paymentStatus.status === 2) {
      console.log("✅ Pago confirmado, procesando pedido:", paymentStatus.commerceOrder)

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
        await prisma.pedido.update({
          where: { id: pedido.id },
          data: { estado: "PROCESANDO" },
        })
        console.log("📦 Pedido actualizado a PROCESANDO")

        for (const item of pedido.items) {
          if (item.producto) {
            const nuevoStock = Math.max(0, item.producto.stock - item.cantidad)
            await prisma.producto.update({
              where: { id: item.producto.id },
              data: { stock: nuevoStock },
            })
            console.log(`📉 Stock actualizado: ${item.producto.nombre}`)
          }
        }

        if (pedido.cliente) {
          const totalGastado = await prisma.pedido.aggregate({
            where: {
              clienteId: pedido.cliente.id,
              estado: { in: ["PROCESANDO", "ENVIADO", "ENTREGADO"] },
            },
            _sum: { total: true },
          })

          const gastoTotal = (totalGastado._sum.total || 0) + pedido.total
          let nuevoSegmento = pedido.cliente.segmento

          if (gastoTotal >= ALTO_TICKET_THRESHOLD) {
            nuevoSegmento = "ALTO_TICKET"
          } else {
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

          await prisma.cliente.update({
            where: { id: pedido.cliente.id },
            data: {
              segmento: nuevoSegmento,
              totalGastado: gastoTotal,
            },
          })
          console.log(`👤 Cliente actualizado: segmento=${nuevoSegmento}`)
        }

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

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("❌ Error en webhook Flow:", error)
    return new NextResponse("OK", { status: 200 })
  }
}

export async function GET() {
  return new NextResponse("Webhook Flow activo", { status: 200 })
}
