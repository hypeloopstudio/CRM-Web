"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { FadeInUp } from "@/components/ui/motion"

const products = [
  {
    id: "1",
    name: "Serum Elixir Brillo",
    tag: "brillo",
    tagline: "Brillo y suavidad instantánea",
    reviews: 1134,
    price: 32990,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Tratamiento Silk Repair",
    tag: "reparación",
    tagline: "Hidratación profunda que se nota",
    reviews: 229,
    price: 45990,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Kit Mantenimiento Rubios",
    tag: "rubios",
    tagline: "Todo lo que tu cabello necesita",
    reviews: 892,
    price: 75990,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Mascarilla Gold Repair",
    tag: "hidratación",
    tagline: "Resultados visibles desde el primer uso",
    reviews: 2492,
    price: 28990,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&h=400&fit=crop",
  },
]

const brands = ["KÉRASTASE", "L'ORÉAL", "WELLA", "OLAPLEX", "REDKEN", "SCHWARZKOPF", "MOROCCANOIL", "MATRIX"]

export function Boutique() {
  const { addItem } = useCart()
  const duplicatedBrands = [...brands, ...brands, ...brands]

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      nombre: product.name,
      precio: product.price,
      imagen: product.image,
    })
  }

  return (
    <section id="boutique" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <FadeInUp className="flex items-end justify-between mb-12">
          <div>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-amber-600 text-sm font-medium tracking-[0.2em] uppercase mb-4"
            >
              Cuidado profesional en casa
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-gray-900"
            >
              La Boutique Rapunzzel
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ x: 5 }}
          >
            <Link 
              href="/tienda" 
              className="hidden md:flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </FadeInUp>

        {/* Products Grid - Hershesons Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              {/* Product Card */}
              <Link href="/tienda" className="block">
                <motion.div 
                  className="relative aspect-[4/5] bg-[#f0f0f0] rounded-xl overflow-hidden mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Tag - Top Left */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-lg md:text-xl font-light text-gray-700">
                      {product.tag}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                      whileHover={{ scale: 1.08, y: -5 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              </Link>

              {/* Product Info */}
              <div className="space-y-1">
                <Link href="/tienda">
                  <h3 className="font-medium text-gray-900 text-sm group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {product.tagline}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-gray-900 text-gray-900" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{product.reviews}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-1">
                  <Button
                    onClick={(e) => { e.preventDefault(); handleAddToCart(product) }}
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-xs"
                  >
                    COMPRAR
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brands - Infinite Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 pt-12"
        >
          <p className="text-center text-sm text-gray-500 mb-8">
            Trabajamos con las mejores marcas del mundo
          </p>
          
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <motion.div 
              className="flex items-center gap-16 whitespace-nowrap"
              animate={{ x: ["0%", "-33.33%"] }}
              transition={{ x: { duration: 20, repeat: Infinity, ease: "linear" } }}
            >
              {duplicatedBrands.map((brand, index) => (
                <motion.span 
                  key={`${brand}-${index}`}
                  className="text-2xl md:text-3xl font-medium text-gray-300 hover:text-amber-500 transition-colors cursor-pointer flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                >
                  {brand}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
