import { AgendaView } from "@/components/agenda-view";

interface SchedulePageProps {

}

export default function SchedulePage({ }: SchedulePageProps) {
    return (
        <div>
            <AgendaView
                compromissos={
                    [
                        {
                            data: "2025-10-24",
                            hora: "10:00",
                            nome: "Revisão de Código",
                        },
                        {
                            data: "2025-10-24",
                            hora: "15:00",
                            nome: "Planejamento Sprint",
                        },
                    ]
                } />
        </div>
    )
}