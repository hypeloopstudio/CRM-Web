import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react"

export function Contact() {
  return (
    <section id="contacto" className="py-24 bg-[#faf8f5]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <p className="text-amber-600 text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Visítanos
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
              Encuéntranos
            </h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Ubicación</h4>
                  <p className="text-gray-600">Avenida Sucre 2356, Ñuñoa, Santiago</p>
                  <p className="text-gray-600">Santiago, Chile</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Teléfono</h4>
                  <p className="text-gray-600">+56 9 1234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">contacto@rapunzzel.cl</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Horario</h4>
                  <p className="text-gray-600">Lunes a Viernes: 9:00 - 20:00</p>
                  <p className="text-gray-600">Sábado: 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-3xl overflow-hidden shadow-lg h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.9977989098387!2d-70.6195!3d-33.4255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI1JzMxLjgiUyA3MMKwMzcnMTAuMiJX!5e0!3m2!1ses!2scl!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
