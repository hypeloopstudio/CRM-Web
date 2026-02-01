"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

const heroProducts = [
  {
    id: "1",
    tag: "volumen",
    name: "Serum Elixir Brillo",
    tagline: "Brillo y suavidad instantánea",
    reviews: 1134,
    price: 32990,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=500&fit=crop",
  },
  {
    id: "2",
    tag: "reparación",
    name: "Tratamiento Silk Repair",
    tagline: "Hidratación profunda que se nota",
    reviews: 229,
    price: 45990,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop",
  },
  {
    id: "3",
    tag: "hidratación",
    name: "Mascarilla Gold Repair",
    tagline: "Resultados visibles desde el primer uso",
    reviews: 2492,
    price: 28990,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=500&fit=crop",
  },
]

export function ShopHero() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { addItem } = useCart()

  const handleAddToCart = (product: typeof heroProducts[0]) => {
    addItem({
      id: product.id,
      nombre: product.name,
      precio: product.price,
      imagen: product.image,
    })
  }

  return (
    <section className="pt-24 pb-8 bg-white">
      <div className="container mx-auto px-6">
        {/* Hero Products Grid - Hershesons Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {heroProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Product Card */}
              <Link href="/tienda" className="block">
                <div className="relative aspect-[4/5] bg-[#f0f0f0] rounded-xl overflow-hidden mb-4">
                  {/* Tag - Top Left - Large */}
                  <motion.div 
                    className="absolute top-6 left-6 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <span className="text-2xl md:text-3xl font-light text-gray-700">
                      {product.tag}
                    </span>
                  </motion.div>

                  {/* Product Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                      animate={{ 
                        scale: hoveredIndex === index ? 1.08 : 1,
                        y: hoveredIndex === index ? -8 : 0
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </Link>

              {/* Product Info */}
              <div className="space-y-2">
                {/* Product Name */}
                <Link href="/tienda">
                  <h3 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Tagline */}
                <p className="text-sm text-gray-500">
                  {product.tagline}
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
                    <span className="text-xs text-gray-500">{product.reviews} Reviews</span>
                  </div>

                  {/* Price */}
                  <span className="font-medium text-gray-900">
                    ${product.price.toLocaleString()}
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
                      handleAddToCart(product)
                    }}
                    variant="outline"
                    className="w-full rounded-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all font-medium"
                  >
                    COMPRAR
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
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
