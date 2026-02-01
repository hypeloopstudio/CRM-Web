import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Mail } from "lucide-react"

export function Footer() {
  const instagramImages = [
    "/images/results/result-1.png",
    "/images/results/result-2.png",
    "/images/results/result-3.png",
    "/images/results/result-4.png",
    "/images/results/result-5.png",
    "/images/results/result-6.png",
    "/images/results/result-1.png",
    "/images/results/result-2.png",
  ]

  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Instagram Feed */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6 py-12">
          <p className="text-center text-sm text-white/60 mb-6">
            Síguenos en Instagram
          </p>
          <a 
            href="https://www.instagram.com/extensionesrapunzzel/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-center text-2xl font-serif text-amber-400 mb-8 hover:text-amber-300 transition-colors"
          >
            @extensionesrapunzzel
          </a>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {instagramImages.map((src, i) => (
              <a 
                key={i} 
                href="https://www.instagram.com/extensionesrapunzzel/"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square rounded-lg overflow-hidden block"
              >
                <img
                  src={src}
                  alt={`Instagram ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white">
                <Image
                  src="/images/brand/logo-rapunzzel.png"
                  alt="Rapunzzel Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-xl font-semibold tracking-wide">
                RAPUNZZEL
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Expertos en la belleza natural y extensiones de lujo. 
              Transformando vidas a través del arte del cabello.
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

          {/* Explorar */}
          <div>
            <h4 className="font-medium text-white mb-6">Explorar</h4>
            <ul className="space-y-3 text-white/60">
              <li><Link href="#" className="hover:text-amber-400 transition-colors">Inicio</Link></li>
              <li><Link href="#servicios" className="hover:text-amber-400 transition-colors">Servicios</Link></li>
              <li><Link href="#boutique" className="hover:text-amber-400 transition-colors">Boutique</Link></li>
              <li><Link href="#reservar" className="hover:text-amber-400 transition-colors">Reservar</Link></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-medium text-white mb-6">Empresa</h4>
            <ul className="space-y-3 text-white/60">
              <li><Link href="#nosotros" className="hover:text-amber-400 transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors">Carreras</Link></li>
              <li><Link href="#contacto" className="hover:text-amber-400 transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium text-white mb-6">Contacto</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li>Avenida Sucre 2356, Ñuñoa</li>
              <li>Santiago, Chile 832000</li>
              <li>Santiago, Chile</li>
              <li className="pt-2">+56 9 1234 5678</li>
              <li>contacto@rapunzzel.cl</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
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
