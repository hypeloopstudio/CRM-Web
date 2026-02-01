import { getProductos } from "@/lib/actions/shop"
import { ShopHeader } from "@/components/shop/shop-header"
import { ProductGrid } from "@/components/shop/product-grid"
import { ShopFooter } from "@/components/shop/shop-footer"
import { ShopHero } from "@/components/shop/shop-hero"

export const metadata = {
  title: "Tienda | Extensiones Rapunzzel",
  description: "Productos profesionales para el cuidado de tu cabello y extensiones",
}

export default async function TiendaPage() {
  const productos = await getProductos()

  return (
    <main className="min-h-screen bg-white">
      <ShopHeader />
      
      {/* Hero Banner with Products - Hershesons Style */}
      <ShopHero productos={productos} />

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-sm text-gray-500 mb-1">Colección Completa</p>
              <h2 className="text-2xl font-serif text-gray-900">Todos los Productos</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{productos.length} productos</span>
            </div>
          </div>
          
          <ProductGrid productos={productos} />
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-16 bg-[#f5f5f5]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Envío Gratis</h3>
              <p className="text-sm text-gray-500">En compras sobre $50.000</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Pago Seguro</h3>
              <p className="text-sm text-gray-500">Transacciones 100% seguras</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Devoluciones</h3>
              <p className="text-sm text-gray-500">30 días para cambios</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Soporte 24/7</h3>
              <p className="text-sm text-gray-500">Atención personalizada</p>
            </div>
          </div>
        </div>
      </section>

      <ShopFooter />
    </main>
  )
}
