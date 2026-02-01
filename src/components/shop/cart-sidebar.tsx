"use client"

import { useCart } from "@/context/cart-context"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CartSidebar() {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-serif">Tu Carrito</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
              <Button 
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="rounded-full"
              >
                Continuar comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.imagen ? (
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                      {item.nombre}
                    </h3>
                    <p className="text-amber-600 font-semibold">
                      ${item.precio.toLocaleString()}
                    </p>
                    
                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500">
              Envío calculado en el checkout
            </p>
            <Button 
              asChild
              className="w-full btn-gold rounded-full py-6"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/tienda/checkout">
                Finalizar Compra
              </Link>
            </Button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm text-gray-500 hover:text-amber-600 transition-colors"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
