"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { ShopHeader } from "@/components/shop/shop-header"
import { Loader2 } from "lucide-react"

// Componente de carga
function LoadingFallback() {
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
      <h1 className="text-3xl font-serif text-gray-900 mb-4">
        Cargando...
      </h1>
      <p className="text-gray-600 mb-8">
        Estamos verificando tu transacción
      </p>
    </div>
  )
}

// Importar el contenido de forma dinámica con ssr: false
const ResultadoContent = dynamic(
  () => import("./resultado-content"),
  { 
    ssr: false,
    loading: () => <LoadingFallback />
  }
)

export default function ResultadoPagoPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <ShopHeader />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <Suspense fallback={<LoadingFallback />}>
            <ResultadoContent />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
