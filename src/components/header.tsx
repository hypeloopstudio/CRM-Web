"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useBooking } from "@/context/booking-context"

// Featured products for the mega menu - Hershesons style
const featuredProducts = [
  {
    id: "1",
    name: "Serum Elixir",
    tag: "brillo",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Silk Repair",
    tag: "reparación",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Gold Mask",
    tag: "hidratación",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Kit Rubios",
    tag: "rubios",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=400&fit=crop",
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const { itemCount, setIsOpen } = useCart()
  const { openBooking } = useBooking()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: "Inicio", href: "#" },
    { name: "Servicios", href: "#servicios" },
    { name: "Tienda", href: "/tienda", hasMegaMenu: true },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Contacto", href: "#contacto" },
  ]

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/" className="flex items-center gap-3">
            <motion.div 
              className={`relative w-10 h-10 rounded-full overflow-hidden transition-all duration-300 ${
                scrolled ? "bg-white shadow-sm" : "bg-white/10 backdrop-blur-sm"
              }`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/images/brand/logo-rapunzzel.png"
                alt="Rapunzzel Logo"
                fill
                className="object-cover"
              />
            </motion.div>
            <span className={`font-serif text-xl font-semibold tracking-wide ${
              scrolled ? "text-gray-900" : "text-white"
            }`}>
              RAPUNZZEL
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="relative"
              onMouseEnter={() => item.hasMegaMenu && setShowMegaMenu(true)}
              onMouseLeave={() => item.hasMegaMenu && setShowMegaMenu(false)}
            >
              <Link
                href={item.href}
                className={`relative text-sm font-medium tracking-wide transition-colors flex items-center gap-1 py-2 ${
                  scrolled 
                    ? "text-gray-600 hover:text-amber-600" 
                    : "text-white/90 hover:text-white"
                } ${item.hasMegaMenu && showMegaMenu ? "border-b-2 border-amber-500" : ""}`}
              >
                <motion.span
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  {item.name}
                </motion.span>
              </Link>

              {/* Mega Menu for Tienda - Hershesons Style */}
              {item.hasMegaMenu && (
                <AnimatePresence>
                  {showMegaMenu && (
                    <>
                      {/* Full width background */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-[72px] bg-white border-b border-gray-100 shadow-lg"
                        style={{ zIndex: 40 }}
                      >
                        <div className="container mx-auto px-6 py-8">
                          <div className="grid grid-cols-4 gap-6">
                            {featuredProducts.map((product, i) => (
                              <Link 
                                key={product.id} 
                                href={`/tienda`}
                                className="group"
                              >
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                >
                                  {/* Product Card */}
                                  <div className="relative aspect-square bg-[#f0f0f0] rounded-xl overflow-hidden mb-3">
                                    {/* Tag - Top Left */}
                                    <div className="absolute top-4 left-4 z-10">
                                      <span className="text-base font-light text-gray-600">
                                        {product.tag}
                                      </span>
                                    </div>

                                    {/* Product Image */}
                                    <div className="absolute inset-0 flex items-center justify-center p-6">
                                      <motion.img
                                        src={product.image}
                                        alt={product.name}
                                        className="max-w-full max-h-full object-contain"
                                        whileHover={{ scale: 1.1, y: -5 }}
                                        transition={{ duration: 0.4 }}
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Product Name */}
                                  <p className="text-center font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                                    {product.name}
                                  </p>
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                            <span className="text-sm text-gray-500">Ver colección completa</span>
                            <Link 
                              href="/tienda" 
                              className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                            >
                              Ir a la tienda →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          ))}
          
          {/* Cart Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            onClick={() => setIsOpen(true)}
            className={`relative p-2 rounded-full transition-colors ${
              scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag className={`w-5 h-5 ${scrolled ? "text-gray-700" : "text-white"}`} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={openBooking}
                className="btn-gold rounded-full text-sm px-6"
              >
                Agendar Cita
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-4 md:hidden">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setIsOpen(true)}
            className="relative p-2"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag className={`w-5 h-5 ${scrolled ? "text-gray-700" : "text-white"}`} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`p-2 ${scrolled ? "text-gray-900" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-amber-600 transition-colors font-medium py-2 block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Button 
                  onClick={() => { setMobileMenuOpen(false); openBooking(); }}
                  className="btn-gold rounded-full mt-2 w-full"
                >
                  Agendar Cita
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
