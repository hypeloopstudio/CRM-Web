import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function Factory() {
  return (
    <section className="py-24 bg-[#C9A227]/10">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop"
                    alt="Extensiones premium"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=500&fit=crop"
                    alt="Cabello natural"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl p-6 flex gap-12">
              <div className="text-center">
                <p className="text-4xl font-serif text-amber-600">10</p>
                <p className="text-sm text-gray-500">Años de experiencia</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif text-amber-600">100%</p>
                <p className="text-sm text-gray-500">Cabello natural</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6">
              Somos Fábrica: Calidad<br />
              <span className="text-amber-600">Sin Intermediarios</span>
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Nuestra historia comenzó hace 10 años con una misión: crear las 
              mejores extensiones del mundo en Chile. Al ser fabricantes directos, 
              controlamos cada etapa de la ingeniería detrás de la belleza del cabello, 
              garantizando la textura premium que tu cabello merece.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Cabello 100% humano Remy",
                "Aplicación sin daño capilar",
                "Duración de hasta 12 meses",
                "Garantía de satisfacción",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <Button 
              asChild 
              className="btn-gold rounded-full px-8 py-6 text-base"
            >
              <Link href="#reservar">Conoce Nuestra Historia</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
