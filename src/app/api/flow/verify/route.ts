import { NextResponse } from "next/server"
import { getFlowPaymentStatus } from "@/lib/flow"
import { sendOrderConfirmationEmail } from "@/lib/actions/shop"
import prisma from "@/lib/prisma"

// Umbral para considerar cliente como "Alto Ticket"
const ALTO_TICKET_THRESHOLD = 100000

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token no proporcionado" }, { status: 400 })
    }

    const paymentStatus = await getFlowPaymentStatus(token)

    // Si el pago fue exitoso, procesar el pedido (fallback del webhook)
    if (paymentStatus.status === 2) {
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

      // Solo procesar si el pedido está pendiente (no fue procesado por webhook)
      if (pedido && pedido.estado === "PENDIENTE") {
        console.log("🔄 Procesando pedido desde verificación (fallback)")

        // 1. Actualizar estado del pedido
        await prisma.pedido.update({
          where: { id: pedido.id },
          data: { estado: "PROCESANDO" },
        })

        // 2. Descontar stock
        for (const item of pedido.items) {
          if (item.producto) {
            const nuevoStock = Math.max(0, item.producto.stock - item.cantidad)
            await prisma.producto.update({
              where: { id: item.producto.id },
              data: { stock: nuevoStock },
            })
          }
        }

        // 3. Actualizar segmento del cliente
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
        }

        // 4. Enviar email de confirmación (fallback)
        console.log("📧 Enviando email de confirmación (fallback)...")
        await sendOrderConfirmationEmail(pedido.id)
      }
    }

    return NextResponse.json({
      status: paymentStatus.status,
      commerceOrder: paymentStatus.commerceOrder,
      amount: paymentStatus.amount,
    })
  } catch (error) {
    console.error("Error verificando pago:", error)
    return NextResponse.json(
      { error: "Error al verificar pago" },
      { status: 500 }
    )
  }
}
