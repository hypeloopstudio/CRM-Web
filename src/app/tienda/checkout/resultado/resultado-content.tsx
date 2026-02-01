"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"

type PaymentStatus = "loading" | "success" | "pending" | "rejected" | "error"

export default function ResultadoContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<PaymentStatus>("loading")
  const [orderId, setOrderId] = useState<string>("")

  useEffect(() => {
    const token = searchParams.get("token")
    const storedOrderId = localStorage.getItem("flow-pending-order")
    
    if (storedOrderId) {
      setOrderId(storedOrderId)
    }

    if (token) {
      // Verificar estado del pago
      fetch("/api/flow/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 2) {
            setStatus("success")
            // Limpiar carrito y orden pendiente
            localStorage.removeItem("rapunzzel-cart-v2")
            localStorage.removeItem("flow-pending-order")
          } else if (data.status === 1) {
            setStatus("pending")
          } else {
            setStatus("rejected")
          }
        })
        .catch(() => {
          setStatus("error")
        })
    } else {
      setStatus("error")
    }
  }, [searchParams])

  const statusConfig = {
    loading: {
      icon: <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />,
      title: "Verificando pago...",
      description: "Estamos confirmando tu transacción",
      bgColor: "bg-amber-100",
    },
    success: {
      icon: <CheckCircle2 className="w-12 h-12 text-green-600" />,
      title: "¡Pago Exitoso!",
      description: `Tu pedido ${orderId ? `#${orderId.slice(-8).toUpperCase()}` : ""} ha sido confirmado. Recibirás un email con los detalles.`,
      bgColor: "bg-green-100",
    },
    pending: {
      icon: <Clock className="w-12 h-12 text-amber-600" />,
      title: "Pago Pendiente",
      description: "Tu pago está siendo procesado. Te notificaremos cuando se confirme.",
      bgColor: "bg-amber-100",
    },
    rejected: {
      icon: <XCircle className="w-12 h-12 text-red-600" />,
      title: "Pago Rechazado",
      description: "No pudimos procesar tu pago. Por favor intenta nuevamente o usa otro método de pago.",
      bgColor: "bg-red-100",
    },
    error: {
      icon: <XCircle className="w-12 h-12 text-red-600" />,
      title: "Error",
      description: "Ocurrió un error al verificar tu pago. Contacta soporte si el problema persiste.",
      bgColor: "bg-red-100",
    },
  }

  const config = statusConfig[status]

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className={`w-24 h-24 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
        {config.icon}
      </div>
      <h1 className="text-3xl font-serif text-gray-900 mb-4">
        {config.title}
      </h1>
      <p className="text-gray-600 mb-8">
        {config.description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {status === "rejected" || status === "error" ? (
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/tienda/checkout">Intentar de nuevo</Link>
            </Button>
            <Button asChild className="btn-gold rounded-full">
              <Link href="/tienda">Volver a la tienda</Link>
            </Button>
          </>
        ) : status !== "loading" ? (
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/tienda">Seguir comprando</Link>
            </Button>
            <Button asChild className="btn-gold rounded-full">
              <Link href="/">Volver al inicio</Link>
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}
