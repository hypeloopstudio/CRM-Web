import crypto from "crypto"

const FLOW_API_URL = process.env.FLOW_API_URL || "https://sandbox.flow.cl/api"
const FLOW_API_KEY = process.env.FLOW_API_KEY || ""
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY || ""

// Crear firma para Flow
function createSignature(params: Record<string, string>): string {
  // Ordenar parámetros alfabéticamente
  const sortedKeys = Object.keys(params).sort()
  const toSign = sortedKeys.map(key => `${key}${params[key]}`).join("")
  
  // Crear HMAC SHA256
  const hmac = crypto.createHmac("sha256", FLOW_SECRET_KEY)
  hmac.update(toSign)
  return hmac.digest("hex")
}

// Crear orden de pago
export async function createFlowPayment(data: {
  commerceOrder: string
  subject: string
  amount: number
  email: string
  urlConfirmation: string
  urlReturn: string
  optional?: Record<string, string>
}) {
  const params: Record<string, string> = {
    apiKey: FLOW_API_KEY,
    commerceOrder: data.commerceOrder,
    subject: data.subject,
    currency: "CLP",
    amount: data.amount.toString(),
    email: data.email,
    urlConfirmation: data.urlConfirmation,
    urlReturn: data.urlReturn,
  }

  // Agregar parámetros opcionales
  if (data.optional) {
    params.optional = JSON.stringify(data.optional)
  }

  // Crear firma
  const signature = createSignature(params)
  params.s = signature

  // Crear FormData para enviar
  const formData = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const response = await fetch(`${FLOW_API_URL}/payment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Error al crear pago en Flow")
  }

  return {
    url: result.url + "?token=" + result.token,
    token: result.token,
    flowOrder: result.flowOrder,
  }
}

// Obtener estado del pago
export async function getFlowPaymentStatus(token: string) {
  const params: Record<string, string> = {
    apiKey: FLOW_API_KEY,
    token,
  }

  const signature = createSignature(params)
  params.s = signature

  const formData = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const response = await fetch(`${FLOW_API_URL}/payment/getStatus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Error al obtener estado del pago")
  }

  return {
    flowOrder: result.flowOrder,
    commerceOrder: result.commerceOrder,
    status: result.status, // 1 = pendiente, 2 = pagado, 3 = rechazado, 4 = anulado
    amount: result.amount,
    payer: result.payer,
    paymentData: result.paymentData,
  }
}

// Verificar firma de respuesta de Flow
export function verifyFlowSignature(params: Record<string, string>, signature: string): boolean {
  const calculatedSignature = createSignature(params)
  return calculatedSignature === signature
}
