import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886" // Twilio sandbox number

let client: twilio.Twilio | null = null

if (accountSid && authToken) {
  client = twilio(accountSid, authToken)
} else {
  console.warn("Twilio credentials not configured. WhatsApp messages will not be sent.")
}

export async function sendWhatsAppConfirmation({
  telefono,
  nombreCliente,
  servicio,
  fecha,
  hora,
}: {
  telefono: string
  nombreCliente: string
  servicio: string
  fecha: string
  hora: string
}) {
  if (!client) {
    console.log("WhatsApp disabled - would send to:", telefono)
    return { success: false, error: "WhatsApp not configured" }
  }

  // Format phone number for WhatsApp (remove spaces, ensure +56 format)
  const cleanPhone = telefono.replace(/\s/g, "")
  const whatsappTo = `whatsapp:${cleanPhone}`

  const message = `✨ *¡Reserva Confirmada!* ✨

Hola ${nombreCliente}, tu cita en *Extensiones Rapunzzel* ha sido agendada exitosamente.

📋 *Detalles de tu cita:*
• Servicio: ${servicio}
• Fecha: ${fecha}
• Hora: ${hora}

📍 *Dirección:*
Avenida Sucre 2356, Ñuñoa, Santiago, Chile 832000

📞 Si necesitas modificar o cancelar tu cita, contáctanos al +56 9 1234 5678

¡Te esperamos! 💇‍♀️✨

_Extensiones Rapunzzel - La Fábrica de Transformaciones_`

  try {
    const result = await client.messages.create({
      body: message,
      from: whatsappFrom,
      to: whatsappTo,
    })

    console.log("WhatsApp sent successfully:", result.sid)
    return { success: true, messageId: result.sid }
  } catch (error) {
    console.error("Error sending WhatsApp:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}

// Alternative: Generate WhatsApp link for manual sending (fallback)
export function generateWhatsAppLink({
  telefono,
  nombreCliente,
  servicio,
  fecha,
  hora,
}: {
  telefono: string
  nombreCliente: string
  servicio: string
  fecha: string
  hora: string
}) {
  const cleanPhone = telefono.replace(/\s/g, "").replace("+", "")
  
  const message = `✨ ¡Reserva Confirmada! ✨

Hola ${nombreCliente}, tu cita en Extensiones Rapunzzel ha sido agendada exitosamente.

📋 Detalles de tu cita:
• Servicio: ${servicio}
• Fecha: ${fecha}
• Hora: ${hora}

¡Te esperamos! 💇‍♀️`

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}
