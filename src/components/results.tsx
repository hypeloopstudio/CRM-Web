"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { FadeInUp } from "@/components/ui/motion"

const results = [
  {
    image: "/images/results/result-1.png",
    title: "Rubio Ceniza Perfecto",
    description: "Extensiones 60cm cabello natural",
    category: "Extensiones",
  },
  {
    image: "/images/results/result-2.png",
    title: "Platino Espectacular",
    description: "Largo extremo con volumen",
    category: "Extensiones",
  },
  {
    image: "/images/results/result-3.png",
    title: "Rubio Miel Natural",
    description: "Extensiones con acabado sedoso",
    category: "Extensiones",
  },
  {
    image: "/images/results/result-4.png",
    title: "Negro Azabache",
    description: "Extensiones premium 70cm",
    category: "Extensiones",
  },
  {
    image: "/images/results/result-5.png",
    title: "Balayage Dorado",
    description: "Iluminación natural profesional",
    category: "Color",
  },
  {
    image: "/images/results/result-6.png",
    title: "Rubio Platino Sedoso",
    description: "Extensiones 65cm ultra natural",
    category: "Extensiones",
  },
]

// Counter animation component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const increment = value / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if (start >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

export function Results() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState(0)

  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setDirection(1)
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % results.length)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setDirection(-1)
    setIsTransitioning(true)
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + results.length) % results.length)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning])

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    setDirection(index > currentIndex ? 1 : -1)
    setIsTransitioning(true)
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 600)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <section id="galeria" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <FadeInUp className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-amber-600 text-sm font-medium tracking-[0.2em] uppercase mb-4"
            >
              Transformaciones Reales
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-gray-900"
            >
              Resultados Rapunzzel
            </motion.h2>
          </div>
          
          {/* Navigation Arrows */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex gap-3 mt-6 md:mt-0"
          >
            <motion.button 
              whileHover={{ scale: 1.1, borderColor: "#f59e0b" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsAutoPlaying(false); prevSlide(); }}
              disabled={isTransitioning}
              className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:text-amber-500 transition-colors duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1, borderColor: "#f59e0b" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsAutoPlaying(false); nextSlide(); }}
              disabled={isTransitioning}
              className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:text-amber-500 transition-colors duration-300 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </FadeInUp>

        {/* Desktop Carousel - Smooth sliding */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="hidden md:block relative"
        >
          <div className="overflow-hidden">
            <motion.div 
              className="flex"
              animate={{ x: `-${currentIndex * 25}%` }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Duplicate items for infinite loop effect */}
              {[...results, ...results].map((result, index) => (
                <motion.div 
                  key={index}
                  className="w-1/4 flex-shrink-0 px-3"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                      <motion.img
                        src={result.image}
                        alt={result.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Overlay */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      {/* Category Badge */}
                      <motion.div 
                        className="absolute top-4 left-4"
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full text-gray-700">
                          {result.category}
                        </span>
                      </motion.div>
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="group-hover:translate-y-0 group-hover:opacity-100 translate-y-4 opacity-0 transition-all duration-500"
                        >
                          <h3 className="font-serif text-xl mb-1">{result.title}</h3>
                          <p className="text-white/80 text-sm">{result.description}</p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile Carousel - Animated transitions */}
        <div className="md:hidden relative">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={results[currentIndex].image}
                  alt={results[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                <motion.div 
                  className="absolute top-4 left-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full text-gray-700">
                    {results[currentIndex].category}
                  </span>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-6 text-white"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-serif text-2xl mb-2">{results[currentIndex].title}</h3>
                  <p className="text-white/80">{results[currentIndex].description}</p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 mt-8"
        >
          {results.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                width: index === currentIndex ? 32 : 8,
                backgroundColor: index === currentIndex ? "#f59e0b" : "#d1d5db",
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          ))}
        </motion.div>

        {/* Stats with animated counters */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-100"
        >
          <motion.div 
            className="text-center"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-4xl md:text-5xl font-serif text-amber-600 mb-2">
              +<AnimatedCounter value={500} />
            </p>
            <p className="text-gray-500 text-sm">Transformaciones</p>
          </motion.div>
          <motion.div 
            className="text-center"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-4xl md:text-5xl font-serif text-amber-600 mb-2">
              <AnimatedCounter value={100} suffix="%" />
            </p>
            <p className="text-gray-500 text-sm">Cabello Natural</p>
          </motion.div>
          <motion.div 
            className="text-center"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-4xl md:text-5xl font-serif text-amber-600 mb-2">
              <AnimatedCounter value={10} suffix="+" />
            </p>
            <p className="text-gray-500 text-sm">Años de Experiencia</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
