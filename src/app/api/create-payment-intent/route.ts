import { NextResponse } from "next/server"
import { createFlowPayment } from "@/lib/flow"

export async function POST(request: Request) {
  try {
    const { orderId, subject, amount, email, customerData } = await request.json()

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"

    const payment = await createFlowPayment({
      commerceOrder: orderId,
      subject,
      amount: Math.round(amount),
      email,
      urlConfirmation: `${baseUrl}/api/flow/confirmation`,
      urlReturn: `${baseUrl}/tienda/checkout/resultado`,
      optional: customerData,
    })

    return NextResponse.json({
      url: payment.url,
      token: payment.token,
    })
  } catch (error) {
    console.error("Error creating Flow payment:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear pago" },
      { status: 500 }
    )
  }
}
