"use server"

import prisma from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { OrderConfirmationEmail } from "@/lib/emails/order-confirmation"
import { TransferInstructionsEmail } from "@/lib/emails/transfer-instructions"
import { render } from "@react-email/render"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Umbral para considerar cliente como "Alto Ticket"
const ALTO_TICKET_THRESHOLD = 100000 // $100.000 CLP

// Función para enviar email con instrucciones de transferencia
export async function sendTransferInstructionsEmail(pedidoId: string, envio: number) {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        cliente: true,
        items: {
          include: {
            producto: true,
          },
        },
      },
    })

    if (!pedido || !pedido.cliente?.email) {
      console.error("No se pudo enviar email: pedido o cliente no encontrado")
      return { success: false, error: "Pedido o cliente no encontrado" }
    }

    const emailHtml = await render(
      TransferInstructionsEmail({
        customerName: pedido.cliente.nombre,
        orderId: pedido.id,
        items: pedido.items.map((item) => ({
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        total: pedido.total,
        envio: envio,
        direccion: pedido.direccion || "",
        fecha: format(pedido.createdAt, "d 'de' MMMM, yyyy", { locale: es }),
      })
    )

    const { data: emailData, error } = await resend.emails.send({
      from: "Rapunzzel <onboarding@resend.dev>",
      to: pedido.cliente.email,
      subject: `Datos para transferencia - Pedido #${pedido.id.slice(-8).toUpperCase()} - Rapunzzel`,
      html: emailHtml,
    })

    if (error) {
      console.error("Error de Resend:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Email de transferencia enviado a:", pedido.cliente.email, "ID:", emailData?.id)
    return { success: true, emailId: emailData?.id }
  } catch (emailError) {
    console.error("Error enviando email de transferencia:", emailError)
    return { success: false, error: String(emailError) }
  }
}

// Función para actualizar estadísticas del cliente después de un pedido
async function updateClientStats(clienteId: string, pedidoTotal: number) {
  try {
    // Calcular total gastado por el cliente
    const totalGastado = await prisma.pedido.aggregate({
      where: {
        clienteId: clienteId,
        estado: { in: ["PENDIENTE", "PROCESANDO", "ENVIADO", "ENTREGADO"] },
      },
      _sum: { total: true },
    })

    const gastoTotal = totalGastado._sum.total || 0

    // Contar pedidos del cliente
    const pedidosCount = await prisma.pedido.count({
      where: {
        clienteId: clienteId,
        estado: { in: ["PENDIENTE", "PROCESANDO", "ENVIADO", "ENTREGADO"] },
      },
    })

    // Determinar nuevo segmento
    let nuevoSegmento: "NUEVO" | "FRECUENTE" | "INACTIVO" | "ALTO_TICKET" = "NUEVO"

    if (gastoTotal >= ALTO_TICKET_THRESHOLD) {
      nuevoSegmento = "ALTO_TICKET"
    } else if (pedidosCount >= 3) {
      nuevoSegmento = "FRECUENTE"
    }

    // Actualizar cliente
    await prisma.cliente.update({
      where: { id: clienteId },
      data: {
        segmento: nuevoSegmento,
        totalGastado: gastoTotal,
        visitasCount: pedidosCount,
      },
    })

    console.log(`👤 Cliente actualizado: segmento=${nuevoSegmento}, totalGastado=${gastoTotal}, pedidos=${pedidosCount}`)
    return { success: true }
  } catch (error) {
    console.error("Error actualizando stats del cliente:", error)
    return { success: false, error: String(error) }
  }
}

// Función para enviar email de confirmación de pedido
export async function sendOrderConfirmationEmail(pedidoId: string) {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        cliente: true,
        items: {
          include: {
            producto: true,
          },
        },
      },
    })

    if (!pedido || !pedido.cliente?.email) {
      console.error("No se pudo enviar email: pedido o cliente no encontrado")
      return { success: false, error: "Pedido o cliente no encontrado" }
    }

    const emailHtml = await render(
      OrderConfirmationEmail({
        customerName: pedido.cliente.nombre,
        orderId: pedido.id,
        items: pedido.items.map((item) => ({
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        total: pedido.total,
        direccion: pedido.direccion || "",
        fecha: format(pedido.createdAt, "d 'de' MMMM, yyyy", { locale: es }),
      })
    )

    const { data: emailData, error } = await resend.emails.send({
      from: "Rapunzzel <onboarding@resend.dev>",
      to: pedido.cliente.email,
      subject: `¡Pago confirmado! Pedido #${pedido.id.slice(-8).toUpperCase()} - Rapunzzel`,
      html: emailHtml,
    })

    if (error) {
      console.error("Error de Resend:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Email de confirmación enviado a:", pedido.cliente.email, "ID:", emailData?.id)
    return { success: true, emailId: emailData?.id }
  } catch (emailError) {
    console.error("Error enviando email de confirmación:", emailError)
    return { success: false, error: String(emailError) }
  }
}

export async function getProductos() {
  const productos = await prisma.producto.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
  })
  return productos
}

export async function getProductoById(id: string) {
  const producto = await prisma.producto.findUnique({
    where: { id },
  })
  return producto
}

export async function getProductosDestacados() {
  const productos = await prisma.producto.findMany({
    where: { activo: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  })
  return productos
}

export async function createPedidoFromCart(data: {
  nombre: string
  email: string
  telefono: string
  direccion: string
  items: {
    productoId: string
    cantidad: number
    precio: number
  }[]
  metodoPago?: string
  envio?: number
}) {
  // Validate phone
  const telefonoLimpio = data.telefono.replace(/\s/g, "")
  if (!/^\+569\d{8}$/.test(telefonoLimpio)) {
    throw new Error("El teléfono debe tener formato +56 9 XXXX XXXX")
  }

  // Format phone
  const telefonoFormateado = `+56 9 ${telefonoLimpio.slice(4, 8)} ${telefonoLimpio.slice(8)}`

  // Find or create client
  let cliente = await prisma.cliente.findFirst({
    where: {
      OR: [
        { telefono: telefonoFormateado },
        { email: data.email },
      ],
    },
  })

  if (cliente) {
    // Update existing client with new data
    cliente = await prisma.cliente.update({
      where: { id: cliente.id },
      data: {
        nombre: data.nombre,
        telefono: telefonoFormateado,
        email: data.email,
      },
    })
  } else {
    // Create new client
    cliente = await prisma.cliente.create({
      data: {
        nombre: data.nombre,
        telefono: telefonoFormateado,
        email: data.email,
        segmento: "NUEVO",
      },
    })
  }

  // Calculate total
  const total = data.items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  )

  // Calcular envío si no viene especificado
  const envio = data.envio !== undefined ? data.envio : (total >= 50000 ? 0 : 5990)

  // Create order
  const pedido = await prisma.pedido.create({
    data: {
      clienteId: cliente.id,
      total,
      estado: "PENDIENTE",
      direccion: data.direccion,
      notas: `Pedido desde la web - ${data.nombre} - Pago: ${data.metodoPago || "transferencia"}`,
      items: {
        create: data.items.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
      },
    },
    include: {
      items: {
        include: {
          producto: true,
        },
      },
    },
  })

  console.log(`📦 Pedido creado: ${pedido.id} - Cliente: ${cliente.nombre} - Método: ${data.metodoPago || "transferencia"}`)

  // Si el método de pago es transferencia (no es Flow), enviar email y actualizar stats
  if (data.metodoPago !== "flow") {
    // Enviar email con instrucciones de transferencia
    console.log("📧 Enviando email de transferencia...")
    const emailResult = await sendTransferInstructionsEmail(pedido.id, envio)
    if (emailResult.success) {
      console.log("✅ Email de transferencia enviado exitosamente")
    } else {
      console.error("⚠️ Error enviando email de transferencia:", emailResult.error)
    }

    // Actualizar estadísticas del cliente
    await updateClientStats(cliente.id, pedido.total)
  }
  // Para Flow, el email y stats se manejan en el webhook de confirmación

  return pedido
}
