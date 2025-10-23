import { apiAdmin } from "@/config/configService";
import { toast } from "react-toastify";
import { create } from "zustand";


export interface ServicesBudgetsProps {
    id_service_item: string;
    service: string;
    value: string;
}

export interface BudgetsProps {
    codigo: string;
    id_orcamento: string;
    status: string;
    label_status: string;
    car: string;
    km: string;
    approval_expires_at: string;
    type_text: string;
    options_dates: any[];
    services: ServicesBudgetsProps[];
    media: any[];
}

interface useBudgetsProps {
    state: {
        budgets: BudgetsProps[];
    },
    actions: {
        getBudgets: (
            page: number,
            per_page: number,
            status: number | undefined
        ) => Promise<void>;
    }
}


export const useBudgets = create<useBudgetsProps>((set, get) => ({
    state: {
        budgets: [],
        selectCategorias: [],
    },
    actions: {
        getBudgets: async (
            page: number,
            per_page: number,
            status: number | undefined = undefined
        ) => {
            try {
                const { data: { data } } = await apiAdmin.get("/copiloto/index.php/provider/estimates", {
                    params: {
                        page, per_page, 
                        ...(status !== undefined && { status })
                    }
                })
                set((state) => ({ state: { ...state.state, budgets: data } }))
            } catch (err) { }
        },
    }
}))