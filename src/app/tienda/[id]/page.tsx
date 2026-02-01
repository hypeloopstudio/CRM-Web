import { notFound } from "next/navigation"
import { getProductoById, getProductos } from "@/lib/actions/shop"
import { ShopHeader } from "@/components/shop/shop-header"
import { ShopFooter } from "@/components/shop/shop-footer"
import { ProductDetail } from "@/components/shop/product-detail"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const producto = await getProductoById(params.id)
  if (!producto) return { title: "Producto no encontrado" }
  
  return {
    title: `${producto.nombre} | Tienda Rapunzzel`,
    description: producto.descripcion || `Compra ${producto.nombre} en nuestra tienda online`,
  }
}

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const producto = await getProductoById(params.id)
  
  if (!producto) {
    notFound()
  }

  const todosProductos = await getProductos()
  const productosRelacionados = todosProductos
    .filter((p) => p.id !== producto.id)
    .slice(0, 4)

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <ShopHeader />
      
      {/* Breadcrumb */}
      <div className="pt-24 pb-4 bg-white">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/tienda" className="hover:text-amber-600 transition-colors">
              Tienda
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{producto.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <ProductDetail producto={producto} />

      {/* Related Products */}
      {productosRelacionados.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-serif text-gray-900 mb-8">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {productosRelacionados.map((prod) => (
                <Link 
                  key={prod.id} 
                  href={`/tienda/${prod.id}`}
                  className="group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
                    {prod.imagen ? (
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-300">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm group-hover:text-amber-600 transition-colors">
                    {prod.nombre}
                  </h3>
                  <p className="text-amber-600 font-semibold">
                    ${prod.precio.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ShopFooter />
    </main>
  )
}
