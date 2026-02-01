"use client"

import { motion } from "framer-motion"
import { Instagram } from "lucide-react"
import { FadeInUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem, ImageZoom } from "@/components/ui/motion"

const team = [
  {
    name: "Valentina Silva",
    role: "Maestra Colorista",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=500&fit=crop&crop=face",
    instagram: "@vale.colorista",
  },
  {
    name: "Camila Rivas",
    role: "Especialista Extensiones",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop&crop=face",
    instagram: "@cami.extensions",
  },
  {
    name: "Ignacia Soto",
    role: "Estilista Senior",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face",
    instagram: "@igna.styles",
  },
  {
    name: "Sofía Arancibia",
    role: "Tratamientos Capilares",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=500&fit=crop&crop=face",
    instagram: "@sofi.hair",
  },
]

export function Team() {
  return (
    <section id="nosotros" className="py-24 bg-[#faf8f5] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Team Grid */}
          <StaggerContainer className="grid grid-cols-4 gap-3" staggerDelay={0.1}>
            {team.map((member, index) => (
              <StaggerItem key={index}>
                <motion.div 
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 p-3 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-white/80">{member.role}</p>
                  </motion.div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Content */}
          <SlideInRight>
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-amber-600 text-sm font-medium tracking-[0.2em] uppercase mb-4"
            >
              El Equipo
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6"
            >
              Nuestras Maestras<br />
              <motion.span 
                className="text-amber-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Coloristas
              </motion.span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 text-lg mb-8 leading-relaxed"
            >
              Artistas del cabello apasionadas por crear cada detalle de tu 
              imagen. Nuestro equipo combina técnica, creatividad y años de 
              experiencia para transformar tu look en una obra maestra.
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-gray-600 mb-8"
            >
              Cada una de nuestras especialistas se capacita constantemente 
              en las últimas tendencias internacionales y técnicas de 
              coloración para ofrecerte resultados excepcionales.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              {team.map((member, index) => (
                <motion.a
                  key={member.instagram}
                  href="#"
                  className="text-gray-400 hover:text-amber-600 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </SlideInRight>
        </div>
      </div>
    </section>
  )
}
