"use client"

import { motion } from "framer-motion"
import { ShoppingBag, Star } from "lucide-react"
import { useCart } from "@/context/cart-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
  if (nameLower.includes("acondicionador") || nameLower.includes("conditioner")) return "suavidad"
  if (nameLower.includes("mascarilla") || nameLower.includes("mask")) return "hidratación"
  if (nameLower.includes("aceite") || nameLower.includes("oil")) return "nutrición"
  if (nameLower.includes("keratina") || nameLower.includes("keratin")) return "reparación"
  if (nameLower.includes("rubio") || nameLower.includes("blonde")) return "rubios"
  if (nameLower.includes("color")) return "color care"
  if (nameLower.includes("volumen") || nameLower.includes("volume")) return "volumen"
  if (nameLower.includes("extensiones") || nameLower.includes("extension")) return "extensiones"
  if (nameLower.includes("tratamiento")) return "tratamiento"
  if (nameLower.includes("kit")) return "kit completo"
  if (nameLower.includes("spray")) return "styling"
  
  return "cuidado"
}

// Generate a short tagline
function getProductTagline(nombre: string): string {
  const nameLower = nombre.toLowerCase()
  
  if (nameLower.includes("serum")) return "Brillo y suavidad instantánea"
  if (nameLower.includes("mascarilla") || nameLower.includes("mask")) return "Hidratación profunda que se nota"
  if (nameLower.includes("kit") || nameLower.includes("rubio")) return "Todo lo que tu cabello necesita"
  if (nameLower.includes("shampoo")) return "Limpieza suave y efectiva"
  if (nameLower.includes("aceite") || nameLower.includes("oil")) return "Nutrición y protección total"
  if (nameLower.includes("spray")) return "Fijación natural sin residuos"
  if (nameLower.includes("tratamiento")) return "Resultados visibles desde el primer uso"
  
  return "Cuidado profesional en casa"
}

// Generate random reviews count for display
function getReviewsCount(id: string): number {
  const hash = id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
  return Math.abs(hash % 2000) + 100
}

export function ProductGrid({ productos }: { productos: Producto[] }) {
  const { addItem } = useCart()

  const handleAddToCart = (producto: Producto) => {
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
    })
  }

  if (productos.length === 0) {
    return (
      <motion.div 
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No hay productos disponibles</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {productos.map((producto, index) => {
        const tag = getProductTag(producto.nombre, producto.descripcion)
        const tagline = producto.descripcion || getProductTagline(producto.nombre)
        const reviewsCount = getReviewsCount(producto.id)
        
        return (
          <motion.div
            key={producto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group"
          >
            {/* Product Card - Hershesons Style */}
            <Link href={`/tienda/${producto.id}`} className="block">
              <motion.div 
                className="relative aspect-[4/5] bg-[#f0f0f0] rounded-xl overflow-hidden mb-4"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                {/* Tag - Top Left - Large */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="text-2xl md:text-3xl font-light text-gray-700">
                    {tag}
                  </span>
                </div>

                {/* Product Image - Centered */}
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  {producto.imagen ? (
                    <motion.img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="max-w-full max-h-full object-contain"
                      whileHover={{ scale: 1.08, y: -8 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  ) : (
                    <ShoppingBag className="w-20 h-20 text-gray-300" />
                  )}
                </div>
              </motion.div>
            </Link>

            {/* Product Info - Below Card */}
            <div className="space-y-2">
              {/* Product Name */}
              <Link href={`/tienda/${producto.id}`}>
                <h3 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                  {producto.nombre}
                </h3>
              </Link>

              {/* Tagline/Description */}
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
  )
}
