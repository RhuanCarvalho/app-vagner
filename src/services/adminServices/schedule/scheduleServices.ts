import { apiAdmin } from "@/config/configService";
import { toast } from "react-toastify";
import { create } from "zustand";

interface ServicesInSchedulesProps {
    id_service_item: string;
    service: string;
    value: string;
}
interface OptionsDatesInSchedulesProps {
    date: string;
    periodo: string;
}

export interface CompromissosProps {
    codigo: string;
    schedule_date: string;
    schedule_period: string;
    id_orcamento: string;
    status: string;
    label_status: string;
    car: string;
    km: string;
    approval_expires_at: string;
    type_text: string;
    options_dates: OptionsDatesInSchedulesProps[],
    services: ServicesInSchedulesProps[],
    media: any[]

}

interface useBudgetsProps {
    state: {
        compromissos: CompromissosProps[];
    },
    actions: {
        getSchedulesPeriod: (period: string) => Promise<void>;
    }
}


export const useSchedules = create<useBudgetsProps>((set, get) => ({
    state: {
        compromissos: [],
    },
    actions: {
        getSchedulesPeriod: async (period: string) => {
            // period: deve ser no formato string YYYY-MM (ex: 2025-10)
            try {
                const { data: { data } } = await apiAdmin.get(`/copiloto/index.php/provider/agenda/${period}`)
                set((state) => ({ state: { ...state.state, compromissos: data } }))
            } catch (err) { }
        },
    }
}))