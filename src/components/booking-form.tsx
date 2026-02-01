"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle2, Loader2, Clock, Check } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { getServiciosAction, createReservaAction, getHorasOcupadasAction } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

type Servicio = {
  id: string
  nombre: string
  precio: number
  duracionMinutos: number
  categoria: { nombre: string }
}

const horasDisponibles = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"
]

// Formatear teléfono mientras se escribe
function formatPhoneInput(value: string): string {
  // Eliminar todo excepto números y +
  let cleaned = value.replace(/[^\d+]/g, "")
  
  // Si no empieza con +56, agregarlo
  if (!cleaned.startsWith("+")) {
    if (cleaned.startsWith("56")) {
      cleaned = "+" + cleaned
    } else if (cleaned.startsWith("9") && cleaned.length <= 9) {
      cleaned = "+56" + cleaned
    } else if (cleaned.length > 0 && !cleaned.startsWith("56")) {
      cleaned = "+569" + cleaned
    }
  }
  
  // Formatear: +56 9 XXXX XXXX
  if (cleaned.length > 3) {
    let formatted = cleaned.slice(0, 3) // +56
    if (cleaned.length > 3) {
      formatted += " " + cleaned.slice(3, 4) // 9
    }
    if (cleaned.length > 4) {
      formatted += " " + cleaned.slice(4, 8) // XXXX
    }
    if (cleaned.length > 8) {
      formatted += " " + cleaned.slice(8, 12) // XXXX
    }
    return formatted
  }
  
  return cleaned
}

// Validar teléfono chileno
function isValidChileanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "")
  return /^\+569\d{8}$/.test(cleaned)
}

export function BookingForm() {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([])
  const [loadingHoras, setLoadingHoras] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [date, setDate] = useState<Date>()
  const [phoneError, setPhoneError] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    servicioId: "",
    hora: "",
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
    async function fetchServicios() {
      const data = await getServiciosAction()
      setServicios(data)
    }
    fetchServicios()
  }, [])

  // Cargar horas ocupadas cuando cambia la fecha
  useEffect(() => {
    async function fetchHorasOcupadas() {
      if (!date) {
        setHorasOcupadas([])
        return
      }
      
      setLoadingHoras(true)
      try {
        const horas = await getHorasOcupadasAction(date)
        setHorasOcupadas(horas)
        // Si la hora seleccionada está ocupada, limpiarla
        if (formData.hora && horas.includes(formData.hora)) {
          setFormData(prev => ({ ...prev, hora: "" }))
        }
      } catch (error) {
        console.error("Error loading hours:", error)
      } finally {
        setLoadingHoras(false)
      }
    }
    fetchHorasOcupadas()
  }, [date])

  const selectedServicio = servicios.find(s => s.id === formData.servicioId)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value)
    setFormData({ ...formData, telefono: formatted })
    
    // Validar solo si tiene suficientes caracteres
    if (formatted.replace(/\s/g, "").length >= 12) {
      if (!isValidChileanPhone(formatted)) {
        setPhoneError("Formato inválido. Usa: +56 9 XXXX XXXX")
      } else {
        setPhoneError("")
      }
    } else {
      setPhoneError("")
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all as touched
    setTouched({ nombre: true, telefono: true })
    
    const newErrors: Record<string, string> = {}
    let hasErrors = false
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "Ingresa tu nombre"
      hasErrors = true
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = "Ingresa tu teléfono"
      hasErrors = true
    } else if (!isValidChileanPhone(formData.telefono)) {
      newErrors.telefono = "Formato: +56 9 XXXX XXXX"
      hasErrors = true
    }
    
    if (!formData.servicioId || !date || !formData.hora) {
      hasErrors = true
    }
    
    setErrors(newErrors)
    
    if (hasErrors) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await createReservaAction({
        nombre: formData.nombre,
        telefono: formData.telefono,
        email: formData.email || undefined,
        servicioId: formData.servicioId,
        fecha: date as Date,
        hora: formData.hora,
        precio: selectedServicio?.precio || 0,
      })
      
      setSuccess(true)
      toast({
        title: "¡Reserva Confirmada!",
        description: "Te contactaremos para confirmar tu cita.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear la reserva. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Reserva Exitosa!</h3>
        <p className="text-gray-600 mb-6">
          Tu cita ha sido registrada. Te enviaremos una confirmación pronto.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
          <p className="text-sm text-gray-600"><strong>Servicio:</strong> {selectedServicio?.nombre}</p>
          <p className="text-sm text-gray-600"><strong>Fecha:</strong> {date && format(date, "PPP", { locale: es })}</p>
          <p className="text-sm text-gray-600"><strong>Hora:</strong> {formData.hora}</p>
        </div>
        <Button onClick={() => {
          setSuccess(false)
          setFormData({ nombre: "", telefono: "", email: "", servicioId: "", hora: "" })
          setDate(undefined)
        }}>
          Hacer otra reserva
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
            Nombre completo <span className="text-amber-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="nombre"
              placeholder="Tu nombre completo"
              value={formData.nombre}
              onChange={(e) => {
                setFormData({ ...formData, nombre: e.target.value })
                if (e.target.value.trim()) {
                  setErrors(prev => ({ ...prev, nombre: "" }))
                }
              }}
              onBlur={() => handleBlur("nombre")}
              className={cn(
                "transition-all duration-200",
                touched.nombre && !formData.nombre.trim()
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/50"
                  : formData.nombre.trim()
                    ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                    : ""
              )}
            />
            {formData.nombre.trim() && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          {touched.nombre && errors.nombre && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500" />
              {errors.nombre}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono" className="text-sm font-medium text-gray-700">
            Teléfono <span className="text-amber-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="telefono"
              type="tel"
              placeholder="+56 9 1234 5678"
              value={formData.telefono}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur("telefono")}
              maxLength={16}
              className={cn(
                "transition-all duration-200",
                (touched.telefono && (!formData.telefono.trim() || phoneError))
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/50"
                  : isValidChileanPhone(formData.telefono)
                    ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                    : ""
              )}
            />
            {isValidChileanPhone(formData.telefono) && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          {(phoneError || (touched.telefono && errors.telefono)) && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500" />
              {phoneError || errors.telefono}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email <span className="text-gray-400 font-normal">(opcional)</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="transition-all duration-200 focus:border-amber-400 focus:ring-amber-100"
        />
      </div>

      <div className="space-y-2">
        <Label>Servicio *</Label>
        <Select
          value={formData.servicioId}
          onValueChange={(value) => setFormData({ ...formData, servicioId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un servicio" />
          </SelectTrigger>
          <SelectContent>
            {servicios.map((servicio) => (
              <SelectItem key={servicio.id} value={servicio.id}>
                {servicio.nombre} - ${servicio.precio.toLocaleString()} ({servicio.duracionMinutos} min)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Fecha *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: es }) : "Selecciona fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  // Limpiar hora seleccionada al cambiar fecha
                  setFormData(prev => ({ ...prev, hora: "" }))
                }}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Hora *</Label>
          <Select
            value={formData.hora}
            onValueChange={(value) => setFormData({ ...formData, hora: value })}
            disabled={!date || loadingHoras}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !date 
                  ? "Primero selecciona fecha" 
                  : loadingHoras 
                    ? "Cargando..." 
                    : "Selecciona hora"
              } />
            </SelectTrigger>
            <SelectContent>
              {horasDisponibles.map((hora) => {
                const isOcupada = horasOcupadas.includes(hora)
                return (
                  <SelectItem 
                    key={hora} 
                    value={hora}
                    disabled={isOcupada}
                    className={isOcupada ? "text-gray-400 line-through" : ""}
                  >
                    <span className="flex items-center gap-2">
                      {hora}
                      {isOcupada && (
                        <span className="text-xs text-red-500 font-medium">(Ocupada)</span>
                      )}
                    </span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {date && horasOcupadas.length > 0 && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {horasDisponibles.length - horasOcupadas.length} horarios disponibles
            </p>
          )}
        </div>
      </div>

      {selectedServicio && (
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-gray-600">Servicio seleccionado:</p>
          <p className="font-semibold text-gray-900">{selectedServicio.nombre}</p>
          <p className="text-2xl font-bold text-primary mt-1">
            ${selectedServicio.precio.toLocaleString()}
          </p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          "Confirmar Reserva"
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Al reservar, aceptas nuestros términos y condiciones. Te contactaremos para confirmar tu cita.
      </p>
    </form>
  )
}
