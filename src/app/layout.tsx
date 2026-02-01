import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/context/cart-context"
import { BookingProvider } from "@/context/booking-context"
import { CartSidebar } from "@/components/shop/cart-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Extensiones Rapunzzel | Luxury Hair Extensions Santiago",
  description: "La fábrica de transformaciones. Expertos en extensiones de cabello 100% natural, coloración y tratamientos capilares de lujo en Santiago, Chile.",
  keywords: "extensiones de cabello, hair extensions, balayage, coloración, tratamientos capilares, santiago, chile",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          <BookingProvider>
            {children}
            <CartSidebar />
          </BookingProvider>
        </CartProvider>
        <Toaster />
      </body>
    </html>
  )
}
