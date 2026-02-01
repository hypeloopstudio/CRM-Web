"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion"

const signatureServices = [
  {
    title: "Extensiones Premium",
    tag: "volumen extremo",
    description: "Técnica de micro-cápsulas y cinta adhesiva invisible para asegurar que tus extensiones se sientan y vean completamente naturales.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=800&fit=crop",
    features: ["Cabello 100% Humano Remy", "Aplicación sin daño capilar", "Duración de hasta 12 meses"],
  },
  {
    title: "Coloración Experta",
    tag: "color perfecto",
    description: "Dominamos las técnicas más avanzadas de color: balayage, highlights, color corrección para transformar tu look.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=800&fit=crop",
    features: ["Productos premium", "Técnicas personalizadas", "Cuidado del cabello"],
  },
  {
    title: "Tratamientos de Brillo",
    tag: "brillo radiante",
    description: "Restaura la vitalidad de tu cabello con nuestros tratamientos de keratina, botox capilar y mascarillas intensivas.",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=800&fit=crop",
    features: ["Keratina brasileña", "Botox capilar", "Hidratación profunda"],
  },
]

function ServiceCard({ service, index }: { service: typeof signatureServices[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      className="group bg-white rounded-3xl overflow-hidden shadow-sm"
      whileHover={{ 
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* Hover Tag */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute top-0 left-0 right-0 z-20 p-5"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <span className="text-base font-light italic text-white drop-shadow-lg">
                {service.tag}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Gradient overlay on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-serif text-gray-900 mb-3">
          {service.title}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {service.description}
        </p>
        <ul className="space-y-2 mb-6">
          {service.features.map((feature, i) => (
            <motion.li 
              key={feature} 
              className="flex items-center gap-2 text-sm text-gray-500"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-amber-500"
                whileHover={{ scale: 1.5 }}
              />
              {feature}
            </motion.li>
          ))}
        </ul>
        <motion.div
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Link 
            href="#reservar"
            className="inline-flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors"
          >
            Conoce más detalles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function Services() {
  return (
    <section id="servicios" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <FadeInUp className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-amber-600 text-sm font-medium tracking-[0.2em] uppercase mb-4"
          >
            Experiencia de Lujo
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Nuestros Servicios Signature
          </h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="section-divider mt-6 origin-center" 
          />
        </FadeInUp>

        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {signatureServices.map((service, index) => (
            <StaggerItem key={index}>
              <ServiceCard service={service} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
