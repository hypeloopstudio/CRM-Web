import Link from "next/link"
import { Sparkles, Instagram, Facebook, Mail } from "lucide-react"

export function ShopFooter() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span className="font-serif text-xl font-semibold tracking-wide">
                RAPUNZZEL
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Productos profesionales para el cuidado de tu cabello y extensiones.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium text-white mb-6">Tienda</h4>
            <ul className="space-y-3 text-white/60">
              <li><Link href="/tienda" className="hover:text-amber-400 transition-colors">Todos los productos</Link></li>
              <li><Link href="/tienda" className="hover:text-amber-400 transition-colors">Shampoos</Link></li>
              <li><Link href="/tienda" className="hover:text-amber-400 transition-colors">Tratamientos</Link></li>
              <li><Link href="/tienda" className="hover:text-amber-400 transition-colors">Accesorios</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-medium text-white mb-6">Ayuda</h4>
            <ul className="space-y-3 text-white/60">
              <li><Link href="#" className="hover:text-amber-400 transition-colors">Preguntas frecuentes</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors">Envíos y entregas</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors">Devoluciones</Link></li>
              <li><Link href="/#contacto" className="hover:text-amber-400 transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-white mb-6">Contacto</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li>Avenida Sucre 2356, Ñuñoa</li>
              <li>Santiago, Chile 832000</li>
              <li>Santiago, Chile</li>
              <li className="pt-2">+56 9 1234 5678</li>
              <li>tienda@rapunzzel.cl</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>&copy; {new Date().getFullYear()} Extensiones Rapunzzel. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Términos</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
