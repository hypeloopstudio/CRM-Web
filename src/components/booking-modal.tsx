"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Check, Clock, CalendarDays, User, Sparkles, Loader2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, getDay, startOfWeek, addWeeks } from "date-fns"
import { es } from "date-fns/locale"
import { getServiciosAction, createReservaAction, getHorasOcupadasAction } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type Servicio = {
  id: string
  nombre: string
  precio: number
  duracionMinutos: number
  categoria: { nombre: string }
}

// Configuración de horas por período del día
const horasPorPeriodo = {
  mañana: ["10:00", "10:45", "11:30"],
  tarde: ["12:15", "13:00", "13:45", "14:30", "15:15", "16:00", "16:45"],
  noche: ["17:30", "18:10", "18:15"],
}

// Formatear teléfono
function formatPhoneInput(value: string): string {
  let cleaned = value.replace(/[^\d+]/g, "")
  
  if (!cleaned.startsWith("+")) {
    if (cleaned.startsWith("56")) {
      cleaned = "+" + cleaned
    } else if (cleaned.startsWith("9") && cleaned.length <= 9) {
      cleaned = "+56" + cleaned
    } else if (cleaned.length > 0 && !cleaned.startsWith("56")) {
      cleaned = "+569" + cleaned
    }
  }
  
  if (cleaned.length > 3) {
    let formatted = cleaned.slice(0, 3)
    if (cleaned.length > 3) formatted += " " + cleaned.slice(3, 4)
    if (cleaned.length > 4) formatted += " " + cleaned.slice(4, 8)
    if (cleaned.length > 8) formatted += " " + cleaned.slice(8, 12)
    return formatted
  }
  
  return cleaned
}

function isValidChileanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "")
  return /^\+569\d{8}$/.test(cleaned)
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [loadingServicios, setLoadingServicios] = useState(true)
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([])
  const [loadingHoras, setLoadingHoras] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const modalContentRef = useRef<HTMLDivElement>(null)
  
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedHora, setSelectedHora] = useState<string>("")
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
  })
  const [phoneError, setPhoneError] = useState("")
  const [formErrors, setFormErrors] = useState<{nombre?: string; telefono?: string}>({})
  const [touched, setTouched] = useState<{nombre?: boolean; telefono?: boolean}>({})
  
  const { toast } = useToast()

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Cargar servicios
  useEffect(() => {
    async function fetchServicios() {
      setLoadingServicios(true)
      try {
        const data = await getServiciosAction()
        setServicios(data)
      } catch (error) {
        console.error("Error loading services:", error)
      } finally {
        setLoadingServicios(false)
      }
    }
    if (isOpen) fetchServicios()
  }, [isOpen])

  // Cargar horas ocupadas cuando cambia la fecha
  useEffect(() => {
    async function fetchHorasOcupadas() {
      if (!selectedDate) {
        setHorasOcupadas([])
        return
      }
      
      setLoadingHoras(true)
      try {
        const horas = await getHorasOcupadasAction(selectedDate)
        setHorasOcupadas(horas)
        if (selectedHora && horas.includes(selectedHora)) {
          setSelectedHora("")
        }
      } catch (error) {
        console.error("Error loading hours:", error)
      } finally {
        setLoadingHoras(false)
      }
    }
    fetchHorasOcupadas()
  }, [selectedDate])

  // Reset cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setSelectedServicio(null)
      setSelectedDate(null)
      setSelectedHora("")
      setFormData({ nombre: "", telefono: "", email: "" })
      setPhoneError("")
    }
  }, [isOpen])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value)
    setFormData({ ...formData, telefono: formatted })
    
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

  const handleSubmit = async () => {
    // Marcar todos los campos como tocados para mostrar errores
    setTouched({ nombre: true, telefono: true })
    
    let hasErrors = false
    const newErrors: {nombre?: string; telefono?: string} = {}
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "Por favor ingresa tu nombre"
      hasErrors = true
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = "Por favor ingresa tu teléfono"
      hasErrors = true
    } else if (!isValidChileanPhone(formData.telefono)) {
      newErrors.telefono = "Formato: +56 9 XXXX XXXX"
      hasErrors = true
    }
    
    setFormErrors(newErrors)
    
    if (hasErrors) {
      toast({
        title: "Campos incompletos",
        description: "Por favor revisa los campos marcados en rojo",
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
        servicioId: selectedServicio!.id,
        fecha: selectedDate!,
        hora: selectedHora,
        precio: selectedServicio!.precio,
      })
      
      setStep(4) // Success step
      toast({
        title: "¡Reserva Confirmada!",
        description: "Te contactaremos para confirmar tu cita.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear la reserva",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calendario
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDay = getDay(monthStart)
  
  // Agregar días vacíos al inicio
  const emptyDays = Array(startDay).fill(null)

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return isBefore(date, today) || getDay(date) === 0 // Domingos deshabilitados
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] mx-4 animate-in fade-in zoom-in-95 duration-300 flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 border-b bg-white rounded-t-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {step > 1 && step < 4 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <div className="w-10" />
            )}
            
            <h2 className="text-lg font-semibold text-gray-900">
              {step === 1 && "Selecciona un servicio"}
              {step === 2 && format(currentMonth, "MMM yyyy", { locale: es })}
              {step === 3 && "Tus datos"}
              {step === 4 && "¡Listo!"}
            </h2>
            
            {step === 2 ? (
              <button
                onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div 
          ref={modalContentRef}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {/* Step 1: Seleccionar Servicio */}
          {step === 1 && (
            <div className="p-6">
              <p className="text-gray-500 text-sm mb-6">Elige el servicio que deseas reservar</p>
              
              {loadingServicios ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="grid gap-3">
                  {servicios.map((servicio) => (
                    <button
                      key={servicio.id}
                      onClick={() => setSelectedServicio(servicio)}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-all duration-200",
                        selectedServicio?.id === servicio.id
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200">
                            <Image
                              src="/images/brand/logo-rapunzzel.png"
                              alt="Rapunzzel"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{servicio.nombre}</h4>
                            <p className="text-sm text-gray-500">
                              {servicio.categoria.nombre} · {servicio.duracionMinutos} min
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-semibold text-gray-900">
                            ${servicio.precio.toLocaleString()}
                          </p>
                          {selectedServicio?.id === servicio.id && (
                            <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Calendario y Hora */}
          {step === 2 && (
            <div className="flex flex-col lg:flex-row">
              {/* Left: Calendar + Hours */}
              <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
                {/* Calendar */}
                <div className="mb-6">
                  {/* Days of week */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["lun", "mar", "mié", "jue", "vie", "sáb", "dom"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid - Empieza en lunes */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Ajustar días vacíos para empezar en lunes */}
                    {Array((getDay(monthStart) + 6) % 7).fill(null).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    {days.map((day) => {
                      const disabled = isDateDisabled(day)
                      const selected = selectedDate && isSameDay(day, selectedDate)
                      const today = isToday(day)
                      const isDomingo = getDay(day) === 0
                      
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => !disabled && setSelectedDate(day)}
                          disabled={disabled}
                          className={cn(
                            "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all",
                            disabled && "text-gray-300 cursor-not-allowed",
                            isDomingo && "text-gray-300",
                            !disabled && !selected && "hover:bg-gray-100 text-gray-700",
                            selected && "bg-gray-900 text-white",
                            today && !selected && "font-bold"
                          )}
                        >
                          {format(day, "d")}
                        </button>
                      )
                    })}
                  </div>

                  {/* Collapse calendar button */}
                  <div className="flex justify-center mt-2">
                    <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                      <ChevronLeft className="w-4 h-4 rotate-90 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Timezone info */}
                <p className="text-xs text-gray-400 text-center mb-6">
                  Las horas corresponden a la siguiente zona horaria: <strong>GMT-3</strong>.
                </p>

                {/* Selected Date + Hours */}
                {selectedDate && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {format(selectedDate, "EEEE, d 'de' MMM 'de' yyyy", { locale: es })}
                    </h4>

                    {loadingHoras ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        {/* Mañana */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-3">Mañana</h5>
                          <div className="flex flex-wrap gap-2">
                            {horasPorPeriodo.mañana.map((hora) => {
                              const ocupada = horasOcupadas.includes(hora)
                              const isSelected = selectedHora === hora
                              return (
                                <button
                                  key={hora}
                                  onClick={() => !ocupada && setSelectedHora(hora)}
                                  disabled={ocupada}
                                  className={cn(
                                    "py-2.5 px-4 rounded-lg text-sm font-medium transition-all min-w-[70px]",
                                    ocupada && "bg-gray-100 text-gray-300 cursor-not-allowed",
                                    !ocupada && !isSelected && "bg-gray-100 text-gray-700 hover:bg-gray-200",
                                    isSelected && "bg-gray-900 text-white"
                                  )}
                                >
                                  {hora}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Tarde */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-3">Tarde</h5>
                          <div className="flex flex-wrap gap-2">
                            {horasPorPeriodo.tarde.map((hora) => {
                              const ocupada = horasOcupadas.includes(hora)
                              const isSelected = selectedHora === hora
                              return (
                                <button
                                  key={hora}
                                  onClick={() => !ocupada && setSelectedHora(hora)}
                                  disabled={ocupada}
                                  className={cn(
                                    "py-2.5 px-4 rounded-lg text-sm font-medium transition-all min-w-[70px]",
                                    ocupada && "bg-gray-100 text-gray-300 cursor-not-allowed",
                                    !ocupada && !isSelected && "bg-gray-100 text-gray-700 hover:bg-gray-200",
                                    isSelected && "bg-gray-900 text-white"
                                  )}
                                >
                                  {hora}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Noche */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-3">Noche</h5>
                          <div className="flex flex-wrap gap-2">
                            {horasPorPeriodo.noche.map((hora) => {
                              const ocupada = horasOcupadas.includes(hora)
                              const isSelected = selectedHora === hora
                              return (
                                <button
                                  key={hora}
                                  onClick={() => !ocupada && setSelectedHora(hora)}
                                  disabled={ocupada}
                                  className={cn(
                                    "py-2.5 px-4 rounded-lg text-sm font-medium transition-all min-w-[70px]",
                                    ocupada && "bg-gray-100 text-gray-300 cursor-not-allowed",
                                    !ocupada && !isSelected && "bg-gray-100 text-gray-700 hover:bg-gray-200",
                                    isSelected && "bg-gray-900 text-white"
                                  )}
                                >
                                  {hora}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    {/* No option link */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">¿No encuentras tu opción preferida?</p>
                      <button className="w-full mt-2 py-3 px-4 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
                        Apúntate a la lista de espera
                      </button>
                    </div>
                  </div>
                )}

                {!selectedDate && (
                  <div className="text-center py-8 text-gray-400">
                    <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Selecciona una fecha para ver los horarios disponibles</p>
                  </div>
                )}
              </div>

              {/* Right: Appointment Summary */}
              <div className="w-full lg:w-80 p-6 bg-gray-50 lg:bg-white">
                <h4 className="font-semibold text-gray-900 mb-4">Resumen de la cita</h4>
                
                {selectedServicio && (
                  <div className="bg-white lg:bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    {/* Service header */}
                    <div className="p-4 flex items-center gap-3 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200">
                        <Image
                          src="/images/brand/logo-rapunzzel.png"
                          alt="Rapunzzel"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{selectedServicio.nombre}</p>
                        <p className="text-sm text-gray-500">
                          ${selectedServicio.precio.toLocaleString()} · {selectedServicio.duracionMinutos} min
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
                    </div>
                    
                    {/* Service detail */}
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{selectedServicio.nombre}</p>
                        <p className="text-sm text-gray-500">
                          {selectedServicio.categoria.nombre}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          ${selectedServicio.precio.toLocaleString()}
                        </span>
                        <button 
                          onClick={() => setStep(1)}
                          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                        >
                          <Pencil className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected datetime */}
                {selectedDate && selectedHora && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-sm text-amber-700 font-medium">Fecha y hora seleccionada</p>
                    <p className="text-amber-900 font-semibold capitalize">
                      {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                    </p>
                    <p className="text-amber-900 font-semibold">{selectedHora} hrs</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Datos del cliente */}
          {step === 3 && (
            <div className="p-6">
              <p className="text-gray-500 text-sm mb-6">Ingresa tu información de contacto</p>

              {/* Resumen */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm">
                    Ra
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedServicio?.nombre}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {selectedDate && format(selectedDate, "EEEE d MMM", { locale: es })} · {selectedHora}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${selectedServicio?.precio.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-gray-700 text-sm font-medium">
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
                          setFormErrors(prev => ({ ...prev, nombre: undefined }))
                        }
                      }}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, nombre: true }))
                        if (!formData.nombre.trim()) {
                          setFormErrors(prev => ({ ...prev, nombre: "Por favor ingresa tu nombre" }))
                        }
                      }}
                      className={cn(
                        "h-12 rounded-xl transition-all duration-200",
                        touched.nombre && !formData.nombre.trim()
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/50"
                          : formData.nombre.trim()
                            ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                            : "border-gray-200"
                      )}
                    />
                    {formData.nombre.trim() && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {touched.nombre && formErrors.nombre && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      {formErrors.nombre}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-gray-700 text-sm font-medium">
                    Teléfono <span className="text-amber-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={formData.telefono}
                      onChange={(e) => {
                        handlePhoneChange(e)
                        if (isValidChileanPhone(e.target.value)) {
                          setFormErrors(prev => ({ ...prev, telefono: undefined }))
                        }
                      }}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, telefono: true }))
                        if (!formData.telefono.trim()) {
                          setFormErrors(prev => ({ ...prev, telefono: "Por favor ingresa tu teléfono" }))
                        } else if (!isValidChileanPhone(formData.telefono)) {
                          setFormErrors(prev => ({ ...prev, telefono: "Formato: +56 9 XXXX XXXX" }))
                        }
                      }}
                      maxLength={16}
                      className={cn(
                        "h-12 rounded-xl transition-all duration-200",
                        (touched.telefono && (!formData.telefono.trim() || phoneError))
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/50"
                          : isValidChileanPhone(formData.telefono)
                            ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                            : "border-gray-200"
                      )}
                    />
                    {isValidChileanPhone(formData.telefono) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {(phoneError || (touched.telefono && formErrors.telefono)) && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      {phoneError || formErrors.telefono}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                    Email <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 rounded-xl border-gray-200 transition-all duration-200 focus:border-amber-400 focus:ring-amber-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="p-8 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Reserva Confirmada!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Tu cita ha sido registrada exitosamente.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 text-left max-w-sm mx-auto mb-6">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm">
                    Ra
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedServicio?.nombre}</p>
                    <p className="text-sm text-gray-500">{selectedServicio?.duracionMinutos} min</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {selectedDate && format(selectedDate, "EEEE d MMM", { locale: es })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hora</span>
                    <span className="font-medium text-gray-900">{selectedHora}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-500">Total</span>
                    <span className="font-semibold text-gray-900">
                      ${selectedServicio?.precio.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-6">
                Te contactaremos pronto para confirmar tu cita.
              </p>

              <Button onClick={onClose} className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12">
                Cerrar
              </Button>
            </div>
          )}
        </div>

        {/* Footer with navigation */}
        {step < 4 && (
          <div className="flex-shrink-0 border-t bg-white px-6 py-4">
            {step === 1 && (
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedServicio}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12 disabled:opacity-50"
              >
                Continuar
              </Button>
            )}

            {step === 2 && (
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedHora}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12 disabled:opacity-50"
              >
                Continuar
              </Button>
            )}

            {step === 3 && (
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.nombre || !formData.telefono}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar Reserva"
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
