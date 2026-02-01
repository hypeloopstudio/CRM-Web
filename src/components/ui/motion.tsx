"use client"

import { motion, useInView, useAnimation, Variants } from "framer-motion"
import { useRef, useEffect, ReactNode } from "react"

// Fade In Up Animation
export function FadeInUp({ 
  children, 
  delay = 0,
  duration = 0.6,
  className = ""
}: { 
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Fade In Animation
export function FadeIn({ 
  children, 
  delay = 0,
  duration = 0.6,
  className = ""
}: { 
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale In Animation
export function ScaleIn({ 
  children, 
  delay = 0,
  className = ""
}: { 
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Slide In From Left
export function SlideInLeft({ 
  children, 
  delay = 0,
  className = ""
}: { 
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -60 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Slide In From Right
export function SlideInRight({ 
  children, 
  delay = 0,
  className = ""
}: { 
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger Container for children animations
export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.1
}: { 
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  }
  
  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger Item - use inside StaggerContainer
export function StaggerItem({ 
  children, 
  className = ""
}: { 
  children: ReactNode
  className?: string
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }
  
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

// Hover Scale Effect
export function HoverScale({ 
  children, 
  scale = 1.03,
  className = ""
}: { 
  children: ReactNode
  scale?: number
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parallax Effect
export function Parallax({ 
  children, 
  offset = 50,
  className = ""
}: { 
  children: ReactNode
  offset?: number
  className?: string
}) {
  const ref = useRef(null)
  
  return (
    <motion.div
      ref={ref}
      initial={{ y: offset }}
      whileInView={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Text Reveal Animation
export function TextReveal({ 
  children, 
  delay = 0,
  className = ""
}: { 
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Floating Animation (continuous)
export function Float({ 
  children, 
  className = ""
}: { 
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Pulse Animation
export function Pulse({ 
  children, 
  className = ""
}: { 
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.02, 1],
        opacity: [1, 0.9, 1],
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Image Hover Zoom
export function ImageZoom({ 
  children, 
  className = ""
}: { 
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      whileHover="hover"
    >
      <motion.div
        variants={{
          hover: { scale: 1.1 }
        }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
