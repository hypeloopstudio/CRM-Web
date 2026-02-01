"use server"

import prisma from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { OrderConfirmationEmail } from "@/lib/emails/order-confirmation"
import { render } from "@react-email/render"
import { format } from "date-fns"
import { es } from "date-fns/locale"

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

  // Create order
  const pedido = await prisma.pedido.create({
    data: {
      clienteId: cliente.id,
      total,
      estado: "PENDIENTE",
      direccion: data.direccion,
      notas: `Pedido desde la web - ${data.nombre}`,
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

  // Send confirmation email
  try {
    const emailHtml = await render(
      OrderConfirmationEmail({
        customerName: data.nombre,
        orderId: pedido.id,
        items: pedido.items.map((item) => ({
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        total: pedido.total,
        direccion: data.direccion,
        fecha: format(pedido.createdAt, "d 'de' MMMM, yyyy", { locale: es }),
      })
    )

    const { data: emailData, error } = await resend.emails.send({
      from: "Rapunzzel <onboarding@resend.dev>",
      to: data.email,
      subject: `¡Pedido confirmado! #${pedido.id.slice(-8).toUpperCase()} - Rapunzzel`,
      html: emailHtml,
    })

    if (error) {
      console.error("Error de Resend:", error)
    } else {
      console.log("Email de confirmación enviado a:", data.email, "ID:", emailData?.id)
    }
  } catch (emailError) {
    // Log error but don't fail the order
    console.error("Error enviando email de confirmación:", emailError)
  }

  return pedido
}
