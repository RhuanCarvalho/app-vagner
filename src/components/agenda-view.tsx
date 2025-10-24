"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import {
  format,
  parseISO,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Compromisso {
  data: string
  hora: string
  nome: string
}

interface AgendaViewProps {
  compromissos: Compromisso[]
}

export function AgendaView({ compromissos }: AgendaViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  // Agrupar compromissos por data
  const compromissosPorData = useMemo(() => {
    const grouped: Record<string, Compromisso[]> = {}
    compromissos.forEach((comp) => {
      const dateKey = comp.data
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(comp)
    })
    // Ordenar compromissos por hora
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.hora.localeCompare(b.hora))
    })
    return grouped
  }, [compromissos])

  // Compromissos do dia selecionado
  const compromissosDodia = useMemo(() => {
    const dateKey = format(selectedDate, "yyyy-MM-dd")
    return compromissosPorData[dateKey] || []
  }, [selectedDate, compromissosPorData])

  // Gerar dias do calendário
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const getCompromissosCount = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    return compromissosPorData[dateKey]?.length || 0
  }

  // Função para ir para hoje
  const goToToday = () => {
    const today = new Date()
    setSelectedDate(today)
    setCurrentMonth(today)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie seus compromissos
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Calendário */}
          <Card className="p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                </h2>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {"←"}
                  </button>
                  <button
                    onClick={goToToday}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Hoje
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {"→"}
                  </button>
                </div>
              </div>
            </div>

            {/* Grid do calendário */}
            <div className="grid grid-cols-7 gap-1">
              {/* Dias da semana */}
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => (
                <div key={dia} className="py-1 text-center text-xs font-medium text-gray-500">
                  {dia}
                </div>
              ))}

              {/* Espaços vazios antes do primeiro dia */}
              {Array.from({ length: calendarDays[0].getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Dias do mês */}
              {calendarDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate)
                const isCurrentDay = isToday(day)
                const compromissosCount = getCompromissosCount(day)
                const hasEvents = compromissosCount > 0
                const isCurrentMonth = isSameMonth(day, currentMonth)

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "relative flex aspect-video flex-col items-center justify-center rounded-lg p-1 text-sm font-medium transition-colors",
                      "hover:bg-gray-100",
                      isSelected && "bg-[#002547] text-white hover:bg-[#001a36]",
                      !isSelected && isCurrentDay && "border-2 border-[#002547]",
                      !isSelected && !isCurrentMonth && "text-gray-400",
                      !isSelected && isCurrentMonth && "text-gray-900"
                    )}
                  >
                    {hasEvents && (
                      <span
                        className={cn(
                          "absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold shadow-sm",
                          isSelected ? "bg-white text-[#002547]" : "bg-[#002547] text-white",
                        )}
                      >
                        {compromissosCount}
                      </span>
                    )}
                    <span>{format(day, "d")}</span>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Compromissos do dia selecionado */}
          <Card className="p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
              </h2>
              <p className="text-xs text-gray-600">
                {compromissosDodia.length === 0
                  ? "Nenhum compromisso"
                  : `${compromissosDodia.length} ${compromissosDodia.length === 1 ? "compromisso" : "compromissos"}`}
              </p>
            </div>

            <div className="space-y-2">
              {compromissosDodia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="mb-3 h-10 w-10 text-gray-300" />
                  <p className="text-xs text-gray-500">Nenhum compromisso agendado para este dia</p>
                </div>
              ) : (
                compromissosDodia.map((comp, index) => (
                  <Card
                    key={index}
                    className="border-l-4 border-l-[#002547] bg-white p-3 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#002547]/10">
                        <Clock className="h-5 w-5 text-[#002547]" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold leading-tight text-gray-900 text-sm">{comp.nome}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="font-mono font-semibold text-[#002547]">{comp.hora}</span>
                          <span>•</span>
                          <span>{format(parseISO(comp.data), "EEEE", { locale: ptBR })}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}