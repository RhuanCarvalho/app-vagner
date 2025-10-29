"use client"

import { useState, useMemo, useEffect } from "react"
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
import { CompromissosProps, useSchedules } from "@/services/adminServices/schedule/scheduleServices"

interface AgendaViewProps {}

export function AgendaView({ }: AgendaViewProps) {
  const { state: { compromissos }, actions: { getSchedulesPeriod } } = useSchedules();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [loading, setLoading] = useState<boolean>(false)

  // Função para formatar a data no formato YYYY-MM
  const formatMonthToApi = (date: Date): string => {
    return format(date, 'yyyy-MM')
  }

  // Função para carregar compromissos com loading
  const loadSchedulesWithLoading = async (month: Date) => {
    setLoading(true)
    try {
      const monthParam = formatMonthToApi(month)
      await getSchedulesPeriod(monthParam)
    } catch (error) {
      console.error('Erro ao carregar compromissos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Carregar compromissos quando o mês mudar
  useEffect(() => {
    loadSchedulesWithLoading(currentMonth)
  }, [currentMonth]) // Recarrega quando currentMonth mudar

  // Também carrega os dados iniciais
  useEffect(() => {
    loadSchedulesWithLoading(currentMonth)
  }, []) // Apenas no mount inicial

  // Agrupar compromissos por data
  const compromissosPorData = useMemo(() => {
    const grouped: Record<string, CompromissosProps[]> = {}
    compromissos.forEach((comp) => {
      const dateKey = comp.schedule_date
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(comp)
    })
    // Ordenar compromissos por hora
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.schedule_period.localeCompare(b.schedule_period))
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

  // Funções de navegação do mês
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Carregando...</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
              <p className="mt-1 text-sm text-gray-500">
                Visualize seus compromissos
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
                    onClick={goToPreviousMonth}
                    disabled={loading}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {"←"}
                  </button>
                  <button
                    onClick={goToToday}
                    disabled={loading}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hoje
                  </button>
                  <button
                    onClick={goToNextMonth}
                    disabled={loading}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={loading}
                    className={cn(
                      "relative flex aspect-video flex-col items-center justify-center rounded-lg p-1 text-sm font-medium transition-colors",
                      "hover:bg-gray-100",
                      isSelected && "bg-[#002547] text-white hover:bg-[#001a36]",
                      !isSelected && isCurrentDay && "border-2 border-[#002547]",
                      !isSelected && !isCurrentMonth && "text-gray-400",
                      !isSelected && isCurrentMonth && "text-gray-900",
                      loading && "opacity-50 cursor-not-allowed"
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
                  <div
                    key={index}
                    className="border border-gray-100 rounded-lg hover:scale-[1.02] shadow-lg shadow-gray-200 bg-white p-3 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold leading-tight text-gray-600 text-sm">{comp.codigo} <span className="px-1">|</span>{comp.car}</h3>
                        <p className="text-[12px] text-gray-600 w-full">Serviços: {comp.services.map(serv => serv.service).join(', ')}</p>
                        <p className={"flex items-center justify-center text-[14px] py-1 px-2 rounded-lg font-bold whitespace-nowrap w-max bg-green-200 text-green-900"}
                          title={comp.schedule_period} // Tooltip com o texto completo
                          >
                          <span className="pr-3"><Clock className="h-5 w-5 text-[#002547]" /></span>
                          <span>{comp.schedule_period}</span>
                          <span className="px-2">•</span>
                          <span>{format(parseISO(comp.schedule_date), "EEEE", { locale: ptBR })}</span>
                      </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}