"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ShopHeader } from "@/components/shop/shop-header"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createPedidoFromCart } from "@/lib/actions/shop"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { 
  ShoppingBag, 
  ChevronLeft, 
  Loader2, 
  CheckCircle2,
  CreditCard,
  Truck,
  Check,
  Banknote,
  ShieldCheck
} from "lucide-react"

type PaymentMethod = "transfer" | "card"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [step, setStep] = useState<1 | 2>(1) // 1: info, 2: payment

  const envio = total >= 50000 ? 0 : 5990
  const totalFinal = total + envio

  const formatPhoneInput = (value: string): string => {
    let cleaned = value.replace(/[^\d+]/g, "")
    if (!cleaned.startsWith("+")) {
      if (cleaned.startsWith("56")) {
        cleaned = "+" + cleaned
      } else if (cleaned.startsWith("9") && cleaned.length <= 9) {
        cleaned = "+56" + cleaned
      } else if (cleaned.length > 0 && !cleaned.startsWith("56")) {
        cleaned = "+569" + cleaned
      }
    }
    if (cleaned.length > 3) {
      let formatted = cleaned.slice(0, 3)
      if (cleaned.length > 3) formatted += " " + cleaned.slice(3, 4)
      if (cleaned.length > 4) formatted += " " + cleaned.slice(4, 8)
      if (cleaned.length > 8) formatted += " " + cleaned.slice(8, 12)
      return formatted
    }
    return cleaned
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "")
    return /^\+569\d{8}$/.test(cleaned)
  }

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "nombre":
        return value.trim() ? "" : "Ingresa tu nombre completo"
      case "email":
        if (!value.trim()) return "Ingresa tu email"
        if (!isValidEmail(value)) return "Email inválido"
        return ""
      case "telefono":
        if (!value.trim()) return "Ingresa tu teléfono"
        if (!isValidPhone(value)) return "Formato: +56 9 XXXX XXXX"
        return ""
      case "direccion":
        return value.trim() ? "" : "Ingresa tu dirección"
      default:
        return ""
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field as keyof typeof formData])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const validateAllFields = () => {
    const allTouched = { nombre: true, email: true, telefono: true, direccion: true }
    setTouched(allTouched)
    
    const newErrors: Record<string, string> = {}
    let hasErrors = false
    
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData])
      if (error) {
        newErrors[field] = error
        hasErrors = true
      }
    })
    
    setErrors(newErrors)
    return !hasErrors
  }

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de continuar",
        variant: "destructive",
      })
      return
    }

    if (!validateAllFields()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor revisa los campos marcados",
        variant: "destructive",
      })
      return
    }

    setStep(2)
  }

  const handleTransferSubmit = async () => {
    setLoading(true)
    try {
      const pedido = await createPedidoFromCart({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        items: items.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        metodoPago: "transferencia",
        envio: envio,
      })
      
      setOrderId(pedido.id)
      setSuccess(true)
      clearCart()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo procesar el pedido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFlowPayment = async () => {
    setLoading(true)
    try {
      // Primero crear el pedido
      const pedido = await createPedidoFromCart({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        items: items.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        metodoPago: "flow",
        envio: envio,
      })

      // Guardar orderId para la página de resultado
      localStorage.setItem("flow-pending-order", pedido.id)

      // Crear pago en Flow
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: pedido.id,
          subject: `Pedido Rapunzzel #${pedido.id.slice(-8).toUpperCase()}`,
          amount: totalFinal,
          email: formData.email,
          customerData: {
            nombre: formData.nombre,
            telefono: formData.telefono,
            direccion: formData.direccion,
          },
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirigir a Flow
        window.location.href = data.url
      } else {
        throw new Error(data.error || "Error al crear pago")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo procesar el pago",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#faf8f5]">
        <ShopHeader />
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-serif text-gray-900 mb-4">
                ¡Pedido Confirmado!
              </h1>
              <p className="text-gray-600 mb-8">
                Tu pedido #{orderId.slice(-8).toUpperCase()} ha sido recibido. 
                Te contactaremos pronto para coordinar el envío.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/tienda">Seguir comprando</Link>
                </Button>
                <Button asChild className="btn-gold rounded-full">
                  <Link href="/">Volver al inicio</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <ShopHeader />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          {/* Back Link */}
          <Link 
            href="/tienda" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>

          <h1 className="text-3xl font-serif text-gray-900 mb-8">Checkout</h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
              <Button asChild className="btn-gold rounded-full">
                <Link href="/tienda">Ir a la tienda</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                {step === 1 && (
                <form onSubmit={handleContinueToPayment} className="space-y-6">
                  {/* Contact Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
                      Información de contacto
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                          Nombre completo <span className="text-amber-500">*</span>
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            onBlur={() => handleBlur("nombre")}
                            placeholder="Tu nombre completo"
                            className={cn(
                              "transition-all duration-200",
                              touched.nombre && errors.nombre
                                ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/50"
                                : formData.nombre.trim()
                                  ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                                  : ""
                            )}
                          />
                          {formData.nombre.trim() && !errors.nombre && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                          )}
                        </div>
                        {touched.nombre && errors.nombre && (
                          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-red-500" />
                            {errors.nombre}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email <span className="text-amber-500">*</span>
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            onBlur={() => handleBlur("email")}
                            placeholder="tu@email.com"
                            className={cn(
                              "transition-all duration-200",
                              touched.email && errors.email
                                ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/50"
                                : formData.email.trim() && isValidEmail(formData.email)
                                  ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                                  : ""
                            )}
                          />
                          {formData.email.trim() && isValidEmail(formData.email) && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                          )}
                        </div>
                        {touched.email && errors.email && (
                          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-red-500" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                          Teléfono <span className="text-amber-500">*</span>
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            id="telefono"
                            type="tel"
                            value={formData.telefono}
                            onChange={(e) => handleChange("telefono", formatPhoneInput(e.target.value))}
                            onBlur={() => handleBlur("telefono")}
                            placeholder="+56 9 1234 5678"
                            maxLength={16}
                            className={cn(
                              "transition-all duration-200",
                              touched.telefono && errors.telefono
                                ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/50"
                                : isValidPhone(formData.telefono)
                                  ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                                  : ""
                            )}
                          />
                          {isValidPhone(formData.telefono) && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                          )}
                        </div>
                        {touched.telefono && errors.telefono && (
                          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-red-500" />
                            {errors.telefono}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
                      Dirección de envío
                    </h2>
                    <div>
                      <Label htmlFor="direccion" className="text-sm font-medium text-gray-700">
                        Dirección completa <span className="text-amber-500">*</span>
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="direccion"
                          value={formData.direccion}
                          onChange={(e) => handleChange("direccion", e.target.value)}
                          onBlur={() => handleBlur("direccion")}
                          placeholder="Calle, número, comuna, ciudad"
                          className={cn(
                            "transition-all duration-200",
                            touched.direccion && errors.direccion
                              ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/50"
                              : formData.direccion.trim()
                                ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                                : ""
                          )}
                        />
                        {formData.direccion.trim() && !errors.direccion && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {touched.direccion && errors.direccion && (
                        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-500" />
                          {errors.direccion}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
                      Método de pago
                    </h2>
                    <div className="space-y-3">
                      {/* Card Payment Option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 border rounded-xl transition-all",
                          paymentMethod === "card"
                            ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          paymentMethod === "card" ? "border-amber-500" : "border-gray-300"
                        )}>
                          {paymentMethod === "card" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          )}
                        </div>
                        <CreditCard className={cn(
                          "w-5 h-5",
                          paymentMethod === "card" ? "text-amber-600" : "text-gray-400"
                        )} />
                        <div className="text-left flex-1">
                          <p className={cn(
                            "font-medium",
                            paymentMethod === "card" ? "text-gray-900" : "text-gray-700"
                          )}>Tarjeta de crédito o débito</p>
                          <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-8 h-5 bg-[#1A1F71] rounded flex items-center justify-center">
                            <span className="text-white text-[8px] font-bold">VISA</span>
                          </div>
                          <div className="w-8 h-5 bg-gradient-to-r from-[#EB001B] to-[#F79E1B] rounded flex items-center justify-center">
                            <div className="flex -space-x-1">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#EB001B]" />
                              <div className="w-2.5 h-2.5 rounded-full bg-[#F79E1B]" />
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Transfer Option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("transfer")}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 border rounded-xl transition-all",
                          paymentMethod === "transfer"
                            ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          paymentMethod === "transfer" ? "border-amber-500" : "border-gray-300"
                        )}>
                          {paymentMethod === "transfer" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          )}
                        </div>
                        <Banknote className={cn(
                          "w-5 h-5",
                          paymentMethod === "transfer" ? "text-amber-600" : "text-gray-400"
                        )} />
                        <div className="text-left flex-1">
                          <p className={cn(
                            "font-medium",
                            paymentMethod === "transfer" ? "text-gray-900" : "text-gray-700"
                          )}>Transferencia bancaria</p>
                          <p className="text-sm text-gray-500">Te enviaremos los datos por email</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-gold rounded-full py-6 text-base"
                  >
                    Continuar al pago
                  </Button>
                </form>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <button 
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Volver a editar información
                    </button>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {paymentMethod === "card" ? "Pago con tarjeta" : "Confirmar pedido"}
                      </h2>

                      {paymentMethod === "card" ? (
                        <div className="space-y-4">
                          {/* Flow Payment Info */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Pago seguro con Flow</p>
                                <p className="text-sm text-gray-500">Serás redirigido a Flow para completar el pago</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>Métodos aceptados:</span>
                              <div className="flex gap-1">
                                <div className="px-2 py-0.5 bg-white rounded text-xs font-medium text-gray-700 shadow-sm">Visa</div>
                                <div className="px-2 py-0.5 bg-white rounded text-xs font-medium text-gray-700 shadow-sm">Mastercard</div>
                                <div className="px-2 py-0.5 bg-white rounded text-xs font-medium text-gray-700 shadow-sm">Redcompra</div>
                              </div>
                            </div>
                          </div>

                          <Button 
                            onClick={handleFlowPayment}
                            disabled={loading}
                            className="w-full btn-gold rounded-full py-6 text-base"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Redirigiendo a Flow...
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Pagar ${totalFinal.toLocaleString()} con Flow
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                            <p className="text-sm text-amber-800 mb-2 font-medium">Instrucciones de pago:</p>
                            <p className="text-sm text-amber-700">
                              Una vez confirmado tu pedido, recibirás un email con los datos bancarios 
                              para realizar la transferencia. Tu pedido será procesado una vez recibido el pago.
                            </p>
                          </div>
                          <Button 
                            onClick={handleTransferSubmit}
                            disabled={loading}
                            className="w-full btn-gold rounded-full py-6 text-base"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Procesando...
                              </>
                            ) : (
                              `Confirmar pedido · $${totalFinal.toLocaleString()}`
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Tus datos están protegidos con encriptación SSL</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">
                    Resumen del pedido
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.imagen ? (
                            <img
                              src={item.imagen}
                              alt={item.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{item.nombre}</p>
                          <p className="text-gray-500 text-sm">Cantidad: {item.cantidad}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          ${(item.precio * item.cantidad).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Envío
                      </span>
                      <span>{envio === 0 ? "Gratis" : `$${envio.toLocaleString()}`}</span>
                    </div>
                    {envio > 0 && (
                      <p className="text-xs text-amber-600">
                        Agrega ${(50000 - total).toLocaleString()} más para envío gratis
                      </p>
                    )}
                    <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t">
                      <span>Total</span>
                      <span>${totalFinal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
