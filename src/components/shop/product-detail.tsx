"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { 
  ShoppingBag, 
  Minus, 
  Plus, 
  Check, 
  Truck, 
  Shield, 
  RotateCcw,
  Star,
  Share2,
  Heart,
  Sparkles,
  Droplets,
  Leaf,
  Award
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Producto = {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  imagen: string | null
}

// Generate product features based on name
function getProductFeatures(nombre: string) {
  const nameLower = nombre.toLowerCase()
  
  if (nameLower.includes("serum") || nameLower.includes("brillo")) {
    return {
      tagline: "Tu cabello brillante, siempre.",
      shortDesc: "Formulado para dar brillo instantáneo sin dejar residuos. Perfecto para todo tipo de cabello.",
      features: [
        { icon: Sparkles, text: "Brillo instantáneo" },
        { icon: Droplets, text: "Fórmula ligera" },
        { icon: Leaf, text: "Sin siliconas dañinas" },
      ],
      benefits: [
        "Brillo inmediato sin efecto graso",
        "Protección contra el calor hasta 230°C",
        "Hidratación profunda"
      ],
      meetTitle: "Conoce el Serum Elixir Brillo",
      meetDesc: "Este serum revolucionario combina aceites naturales con tecnología de última generación para dar a tu cabello un brillo espectacular sin apelmazar. Ideal para uso diario.",
      whyTitle: "¿Por qué lo creamos?",
      whyDesc: "Porque creemos que el brillo no debe comprometer la salud de tu cabello. Nuestra fórmula exclusiva nutre mientras ilumina, dejando tu melena radiante y saludable."
    }
  }
  
  if (nameLower.includes("mascarilla") || nameLower.includes("mask") || nameLower.includes("hidrat")) {
    return {
      tagline: "Hidratación profunda, resultados visibles.",
      shortDesc: "Tratamiento intensivo que restaura la hidratación natural de tu cabello en solo minutos.",
      features: [
        { icon: Droplets, text: "Hidratación 72h" },
        { icon: Leaf, text: "Ingredientes naturales" },
        { icon: Award, text: "Resultados profesionales" },
      ],
      benefits: [
        "Restaura la hidratación natural",
        "Reduce el frizz hasta un 90%",
        "Fortalece desde la raíz"
      ],
      meetTitle: "Conoce la Mascarilla Gold Repair",
      meetDesc: "Una mascarilla de tratamiento intensivo formulada con ingredientes premium que penetran profundamente en la fibra capilar para restaurar la hidratación perdida.",
      whyTitle: "¿Por qué lo creamos?",
      whyDesc: "El cabello seco y dañado necesita más que un simple acondicionador. Creamos esta mascarilla para ofrecer un tratamiento de spa en tu hogar, con resultados visibles desde la primera aplicación."
    }
  }
  
  if (nameLower.includes("kit") || nameLower.includes("rubio") || nameLower.includes("blonde")) {
    return {
      tagline: "Todo lo que tu rubio necesita.",
      shortDesc: "Kit completo diseñado específicamente para mantener y realzar los cabellos rubios.",
      features: [
        { icon: Sparkles, text: "Matiza tonos amarillos" },
        { icon: Shield, text: "Protección color" },
        { icon: Award, text: "Kit profesional" },
      ],
      benefits: [
        "Neutraliza tonos no deseados",
        "Aporta brillo platino",
        "Mantiene el color por más tiempo"
      ],
      meetTitle: "Conoce el Kit Mantenimiento Rubios",
      meetDesc: "Este kit incluye todo lo necesario para mantener tu rubio vibrante y saludable. Shampoo matizador, mascarilla nutritiva y serum protector trabajan en sinergia.",
      whyTitle: "¿Por qué lo creamos?",
      whyDesc: "Los rubios requieren cuidados especiales. Este kit fue desarrollado junto a coloristas profesionales para ofrecer en casa los mismos resultados del salón."
    }
  }
  
  // Default
  return {
    tagline: "Cuidado profesional en casa.",
    shortDesc: "Producto premium formulado para ofrecer resultados de salón en la comodidad de tu hogar.",
    features: [
      { icon: Award, text: "Calidad profesional" },
      { icon: Leaf, text: "Ingredientes premium" },
      { icon: Shield, text: "Resultados garantizados" },
    ],
    benefits: [
      "Fórmula profesional",
      "Resultados visibles",
      "Apto para uso diario"
    ],
    meetTitle: `Conoce ${nombre}`,
    meetDesc: "Un producto cuidadosamente formulado para satisfacer las necesidades de tu cabello, ofreciendo resultados profesionales en cada uso.",
    whyTitle: "¿Por qué lo creamos?",
    whyDesc: "Porque creemos que todos merecen tener acceso a productos de calidad profesional sin necesidad de ir al salón."
  }
}

export function ProductDetail({ producto }: { producto: Producto }) {
  const [cantidad, setCantidad] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCart()
  const { toast } = useToast()

  const productInfo = getProductFeatures(producto.nombre)

  // Generate multiple images (using the same image with different styling for demo)
  const images = producto.imagen 
    ? [producto.imagen, producto.imagen, producto.imagen, producto.imagen]
    : []

  const handleAddToCart = () => {
    for (let i = 0; i < cantidad; i++) {
      addItem({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
      })
    }
    toast({
      title: "Producto agregado",
      description: `${cantidad}x ${producto.nombre} agregado al carrito`,
    })
  }

  return (
    <>
      {/* Main Product Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery - Left Side */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div 
                className="aspect-square rounded-2xl overflow-hidden bg-[#f5f5f5] relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Features list overlay - Top Left */}
                <div className="absolute top-6 left-6 z-10 space-y-2">
                  {productInfo.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-2 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full"
                    >
                      <feature.icon className="w-4 h-4" />
                      <span>{feature.text}</span>
                    </motion.div>
                  ))}
                </div>

                {producto.imagen ? (
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    alt={producto.nombre}
                    className="w-full h-full object-contain p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-24 h-24 text-gray-300" />
                  </div>
                )}
              </motion.div>

              {/* Thumbnail Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-xl overflow-hidden bg-[#f5f5f5] border-2 transition-all ${
                        selectedImage === index ? "border-amber-500" : "border-transparent hover:border-gray-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={img}
                        alt={`${producto.nombre} ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info - Right Side */}
            <div className="flex flex-col">
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">128 reseñas</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">
                {producto.nombre}
              </h1>
              
              {/* Price */}
              <p className="text-2xl font-semibold text-gray-900 mb-4">
                ${producto.precio.toLocaleString()} <span className="text-sm text-gray-400 font-normal">CLP</span>
              </p>

              {/* Tagline */}
              <p className="text-gray-600 mb-2">
                {productInfo.tagline}
              </p>

              {/* Short Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {producto.descripcion || productInfo.shortDesc}
              </p>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {productInfo.benefits.map((benefit, i) => (
                  <span 
                    key={i}
                    className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full"
                  >
                    <Check className="w-3 h-3 text-green-500" />
                    {benefit}
                  </span>
                ))}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{cantidad}</span>
                    <button
                      onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stock Status */}
                  {producto.stock > 0 ? (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      {producto.stock > 10 ? "En stock" : `Solo ${producto.stock} disponibles`}
                    </span>
                  ) : (
                    <span className="text-sm text-red-500">Agotado</span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={producto.stock === 0}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-6 text-base font-medium"
                >
                  Agregar al carrito · ${(producto.precio * cantidad).toLocaleString()}
                </Button>
              </motion.div>

              {/* Secondary Actions */}
              <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
                <button className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                  <Heart className="w-4 h-4" />
                  Guardar
                </button>
                <button className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Compartir
                </button>
              </div>

              {/* Shipping Info */}
              <div className="mt-8 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span>Envío gratis en compras sobre $50.000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <span>Garantía de calidad profesional</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RotateCcw className="w-5 h-5 text-amber-600" />
                  <span>30 días para devolución</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Product Section - Like Hershesons */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-1 bg-amber-500 mb-6" />
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
                {productInfo.meetTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                {productInfo.meetDesc}
              </p>
              <ul className="space-y-4">
                {productInfo.benefits.map((benefit, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=1000&fit=crop"
                  alt="Modelo usando producto"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why We Made It Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=1000&fit=crop"
                  alt="Proceso de creación"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="w-12 h-1 bg-amber-500 mb-6" />
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
                {productInfo.whyTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                {productInfo.whyDesc}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAddToCart}
                  className="btn-gold rounded-full px-8 py-6"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Agregar al carrito · ${producto.precio.toLocaleString()}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
