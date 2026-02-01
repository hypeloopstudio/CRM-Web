"use server"

import prisma from "@/lib/prisma"
import { startOfDay, endOfDay, format } from "date-fns"
import { es } from "date-fns/locale"
import { sendWhatsAppConfirmation } from "@/lib/whatsapp"

export async function getServiciosAction() {
  const servicios = await prisma.servicio.findMany({
    where: { activo: true },
    select: {
      id: true,
      nombre: true,
      precio: true,
      duracionMinutos: true,
      categoria: {
        select: { nombre: true },
      },
    },
    orderBy: { nombre: "asc" },
  })
  return servicios
}

// Obtener las horas ocupadas para una fecha específica
export async function getHorasOcupadasAction(fecha: Date) {
  const reservas = await prisma.reserva.findMany({
    where: {
      fecha: {
        gte: startOfDay(fecha),
        lte: endOfDay(fecha),
      },
      estado: {
        notIn: ["CANCELADO", "FINALIZADO"],
      },
    },
    select: {
      horaInicio: true,
    },
  })

  return reservas.map((r) => r.horaInicio)
}

// Validar teléfono chileno (función interna)
function validarTelefonoChileno(telefono: string): boolean {
  const telefonoLimpio = telefono.replace(/\s/g, "")
  return /^\+569\d{8}$/.test(telefonoLimpio)
}

// Formatear teléfono (función interna)
function formatearTelefono(telefono: string): string {
  const telefonoLimpio = telefono.replace(/\s/g, "")
  if (telefonoLimpio.length === 12 && telefonoLimpio.startsWith("+569")) {
    return `+56 9 ${telefonoLimpio.slice(4, 8)} ${telefonoLimpio.slice(8)}`
  }
  return telefono
}

export async function createReservaAction(data: {
  nombre: string
  telefono: string
  email?: string
  servicioId: string
  fecha: Date
  hora: string
  precio: number
}) {
  // Validar teléfono
  if (!validarTelefonoChileno(data.telefono)) {
    throw new Error("El teléfono debe tener formato +56 9 XXXX XXXX")
  }

  // Verificar que la hora no esté ocupada
  const horasOcupadas = await getHorasOcupadasAction(data.fecha)
  if (horasOcupadas.includes(data.hora)) {
    throw new Error("Esta hora ya está reservada. Por favor selecciona otra.")
  }

  // Formatear teléfono
  const telefonoFormateado = formatearTelefono(data.telefono)

  // Buscar si el cliente ya existe por teléfono o email
  let cliente = await prisma.cliente.findFirst({
    where: {
      OR: [
        { telefono: telefonoFormateado },
        ...(data.email ? [{ email: data.email }] : []),
      ],
    },
  })

  // Si no existe, crear nuevo cliente
  if (!cliente) {
    cliente = await prisma.cliente.create({
      data: {
        nombre: data.nombre,
        telefono: telefonoFormateado,
        email: data.email,
        segmento: "NUEVO",
      },
    })
  } else {
    // Actualizar nombre si cambió
    await prisma.cliente.update({
      where: { id: cliente.id },
      data: {
        nombre: data.nombre,
        ...(data.email && { email: data.email }),
      },
    })
  }

  // Obtener información del servicio para el mensaje
  const servicio = await prisma.servicio.findUnique({
    where: { id: data.servicioId },
    select: { nombre: true },
  })

  // Crear la reserva
  const reserva = await prisma.reserva.create({
    data: {
      clienteId: cliente.id,
      servicioId: data.servicioId,
      fecha: data.fecha,
      horaInicio: data.hora,
      precio: data.precio,
      estado: "NUEVO",
      notas: "Reserva desde la web",
    },
  })

  // Enviar WhatsApp de confirmación (no bloqueante)
  try {
    const fechaFormateada = format(data.fecha, "EEEE d 'de' MMMM, yyyy", { locale: es })
    
    await sendWhatsAppConfirmation({
      telefono: telefonoFormateado,
      nombreCliente: data.nombre,
      servicio: servicio?.nombre || "Servicio",
      fecha: fechaFormateada,
      hora: data.hora,
    })
  } catch (whatsappError) {
    // Log error but don't fail the reservation
    console.error("Error enviando WhatsApp:", whatsappError)
  }

  return reserva
}
