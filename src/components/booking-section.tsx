"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useBooking } from "@/context/booking-context"
import { CalendarDays, Clock, ArrowRight } from "lucide-react"
import { SlideInLeft, SlideInRight } from "@/components/ui/motion"

export function BookingSection() {
  const { openBooking } = useBooking()

  const steps = [
    {
      number: "1",
      title: "Consulta Personalizada",
      description: "Evaluamos tu cabello y definimos el mejor tratamiento"
    },
    {
      number: "2",
      title: "Aplicación Experta",
      description: "Nuestras maestras realizan el trabajo con precisión"
    },
    {
      number: "3",
      title: "Resultado Garantizado",
      description: "Sales con el look de tus sueños y seguimiento post-servicio"
    }
  ]

  return (
    <section id="reservar" className="py-24 bg-gradient-to-br from-[#f8f6f3] via-[#f5f2ed] to-[#f0ebe4] relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content - Left Side */}
          <SlideInLeft>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-amber-700 text-sm font-medium tracking-[0.2em] uppercase mb-4"
            >
              Reserva tu transformación
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6"
            >
              Tu Nueva Imagen<br />
              <span className="text-amber-600">Te Espera</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 text-lg mb-10 leading-relaxed"
            >
              Agenda tu cita y vive la experiencia Rapunzzel. Nuestras expertas 
              te asesorarán para encontrar el look perfecto que realce tu belleza natural.
            </motion.p>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.number}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1, backgroundColor: "#fef3c7" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-amber-700 font-serif text-lg">{step.number}</span>
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-gray-500 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </SlideInLeft>

          {/* Booking Card - Right Side */}
          <SlideInRight className="relative">
            <motion.div 
              className="bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center relative overflow-hidden border border-gray-100"
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Subtle background decoration */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-50 rounded-full opacity-60" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-50 rounded-full opacity-60" />
              
              <div className="relative">
                {/* Rapunzzel Logo */}
                <motion.div 
                  className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-6 shadow-lg border-2 border-amber-100"
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: 3 }}
                  whileHover={{ rotate: -3, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src="/images/brand/logo-rapunzzel.png"
                    alt="Rapunzzel"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-3xl font-serif text-gray-900 mb-3"
                >
                  Agenda tu Cita
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-gray-500 mb-8 max-w-sm mx-auto"
                >
                  Reserva en menos de 2 minutos y asegura tu horario preferido
                </motion.p>

                <motion.button
                  onClick={openBooking}
                  className="group w-full bg-gray-900 text-white font-medium py-4 px-8 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <CalendarDays className="w-5 h-5" />
                  Reservar Ahora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.div 
                  className="mt-8 pt-6 border-t border-gray-100"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-sm">Lun - Sáb</span>
                    </div>
                    <span className="text-sm font-medium">09:00 - 19:00</span>
                  </div>
                </motion.div>

                <motion.p 
                  className="mt-6 text-xs text-gray-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  Sin compromiso • Confirmación inmediata • Asesoría incluida
                </motion.p>
              </div>
            </motion.div>
          </SlideInRight>
        </div>
      </div>
    </section>
  )
}
