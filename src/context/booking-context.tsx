"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { BookingModal } from "@/components/booking-modal"

interface BookingContextType {
  openBooking: () => void
  closeBooking: () => void
  isOpen: boolean
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openBooking = () => setIsOpen(true)
  const closeBooking = () => setIsOpen(false)

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking, isOpen }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={closeBooking} />
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
