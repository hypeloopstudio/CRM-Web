"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

type Producto = {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  imagen: string | null
}

// Generate a tag based on product name/description
function getProductTag(nombre: string, descripcion: string | null): string {
  const nameLower = nombre.toLowerCase()
  const descLower = (descripcion || "").toLowerCase()
  
  if (nameLower.includes("serum") || descLower.includes("brillo")) return "brillo"
  if (nameLower.includes("shampoo") || nameLower.includes("champú")) return "limpieza"
  if (nameLower.includes("mascarilla") || nameLower.includes("mask")) return "hidratación"
  if (nameLower.includes("aceite") || nameLower.includes("oil")) return "nutrición"
  if (nameLower.includes("keratina") || nameLower.includes("keratin")) return "reparación"
  if (nameLower.includes("tratamiento")) return "tratamiento"
  if (nameLower.includes("kit")) return "kit completo"
  
  return "cuidado"
}

// Generate a short tagline
function getProductTagline(nombre: string, descripcion: string | null): string {
  if (descripcion) return descripcion
  
  const nameLower = nombre.toLowerCase()
  if (nameLower.includes("serum")) return "Brillo y suavidad instantánea"
  if (nameLower.includes("mascarilla")) return "Hidratación profunda que se nota"
  if (nameLower.includes("kit")) return "Todo lo que tu cabello necesita"
  if (nameLower.includes("shampoo")) return "Limpieza suave y efectiva"
  if (nameLower.includes("tratamiento")) return "Resultados visibles desde el primer uso"
  
  return "Cuidado profesional en casa"
}

// Generate deterministic reviews count based on id
function getReviewsCount(id: string): number {
  const hash = id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
  return Math.abs(hash % 2000) + 100
}

interface ShopHeroProps {
  productos?: Producto[]
}

export function ShopHero({ productos = [] }: ShopHeroProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { addItem } = useCart()

  // Take first 3 products for hero section
  const heroProducts = productos.slice(0, 3)

  const handleAddToCart = (producto: Producto) => {
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
    })
  }

  // If no products, show a simple hero banner
  if (heroProducts.length === 0) {
    return (
      <section className="pt-24 pb-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center py-16">
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
              Nuestra Colección
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Productos profesionales para el cuidado de tu cabello
            </p>
            <Link href="/tienda">
              <Button className="btn-gold rounded-full px-8">
                Ver productos
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-24 pb-8 bg-white">
      <div className="container mx-auto px-6">
        {/* Hero Products Grid - Hershesons Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {heroProducts.map((producto, index) => {
            const tag = getProductTag(producto.nombre, producto.descripcion)
            const tagline = getProductTagline(producto.nombre, producto.descripcion)
            const reviewsCount = getReviewsCount(producto.id)
            
            return (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Product Card */}
                <Link href={`/tienda/${producto.id}`} className="block">
                  <div className="relative aspect-[4/5] bg-[#f0f0f0] rounded-xl overflow-hidden mb-4">
                    {/* Tag - Top Left - Large */}
                    <motion.div 
                      className="absolute top-6 left-6 z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <span className="text-2xl md:text-3xl font-light text-gray-700">
                        {tag}
                      </span>
                    </motion.div>

                    {/* Product Image */}
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                      {producto.imagen ? (
                        <motion.img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="max-w-full max-h-full object-contain"
                          animate={{ 
                            scale: hoveredIndex === index ? 1.08 : 1,
                            y: hoveredIndex === index ? -8 : 0
                          }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      ) : (
                        <ShoppingBag className="w-20 h-20 text-gray-300" />
                      )}
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="space-y-2">
                  {/* Product Name */}
                  <Link href={`/tienda/${producto.id}`}>
                    <h3 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                      {producto.nombre}
                    </h3>
                  </Link>

                  {/* Tagline */}
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {tagline}
                  </p>

                  {/* Rating and Price Row */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className="w-3.5 h-3.5 fill-gray-900 text-gray-900" 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{reviewsCount} Reviews</span>
                    </div>

                    {/* Price */}
                    <span className="font-medium text-gray-900">
                      ${producto.precio.toLocaleString()}
                    </span>
                  </div>

                  {/* Buy Now Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="pt-2"
                  >
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(producto)
                      }}
                      variant="outline"
                      className="w-full rounded-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all font-medium"
                    >
                      COMPRAR
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Divider with sort options */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Ordenar por</span>
            <select className="text-sm text-gray-700 bg-transparent border border-gray-300 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:border-amber-500">
              <option>Más vendidos</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
              <option>Más recientes</option>
            </select>
          </div>
          <span className="text-sm text-gray-500">Filtros</span>
        </div>
      </div>
    </section>
  )
}
