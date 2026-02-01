"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

const CART_STORAGE_KEY = "rapunzzel-cart-v2"

export type CartItem = {
  id: string
  nombre: string
  precio: number
  imagen: string | null
  cantidad: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "cantidad">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, cantidad: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Helper to get initial cart from localStorage
function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (e) {
    console.error("Error loading cart:", e)
  }
  return []
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    const savedCart = getInitialCart()
    setItems(savedCart)
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever items change (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (item: Omit<CartItem, "cantidad">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      }
      return [...prev, { ...item, cantidad: 1 }]
    })
    setIsOpen(true)
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad } : i))
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
