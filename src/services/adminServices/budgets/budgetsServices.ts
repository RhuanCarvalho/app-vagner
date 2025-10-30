import { MediaItem } from "@/components/galleryMedias";
import { apiAdmin } from "@/config/configService";
import { toast } from "react-toastify";
import { create } from "zustand";

interface DataVerifyCheckin {
    code: string | null | undefined;
    company: string | null | undefined;
    id: string | null | undefined;
    type: string | null | undefined | "estimate" | "schedule";
    id_estimate_service: string;
}

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

interface ServicesBudgetProps {
    service: string;
    value: string;
    id_service_item: string;
}

interface Budget {
    status: string;
    label_status: string;
    car: string;
    km: string;
    genero: string;
    idade: string;
    periodo: string;
    approval_expires_at: string;
    date_schedule: string;
    services: ServicesBudgetProps[];
    media: MediaItem[];
    company_name: string;
    company_image: string;
    options_dates: { date: string, periodo: string}[]
}

interface DataRejectedBudget {
    id: string;
    type: string;
    company: string;
    id_estimate_service: string;
}

interface useBudgetsProps {
    state: {
        budgets: BudgetsProps[];
        budget: Budget;
        checkinData: DataVerifyCheckin;
        retornoMessageAPI: string;
    },
    actions: {
        getBudgets: (
            page: number,
            per_page: number,
            status: number | undefined
        ) => Promise<void>;
        setBudgetOpen: (budget: BudgetsProps, checkinData: DataVerifyCheckin ) => void;
        sendBudget: (sendJson: any) => Promise<boolean>;
        cleanMessage: () => void;
        // RejectedService: (sendJson: DataRejectedBudget) => Promise<void>;
    }
}


export const useBudgets = create<useBudgetsProps>((set, get) => ({
    state: {
        budgets: [],
        budget: {} as Budget,
        checkinData: {} as DataVerifyCheckin,
        retornoMessageAPI: ''
    },
    actions: {
        cleanMessage: () => set((state) => ({ state: { ...state.state, retornoMessageAPI: '' } })),
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
        setBudgetOpen: (budget: BudgetsProps, checkinData: DataVerifyCheckin ) => {
            set((state) => ({
                    state: {
                        ...state.state,
                        budget: {
                            status: budget.status,
                            label_status: budget.label_status,
                            car: budget.car,
                            km: budget.km,
                            genero: '', // Faltou essa Informação
                            idade: '', // Faltou essa informação
                            periodo: '',
                            approval_expires_at: budget.approval_expires_at,
                            date_schedule: '',
                            services: budget.services,
                            media: budget.media,
                            company_name: '', // Faltou essa informação
                            company_image: '', // Faltou essa informação
                            options_dates: budget.options_dates, 
                        },
                        checkinData,
                    }
                }))
        },
        sendBudget: async (sendJson: any) => {
            try {
                const { data } = await apiAdmin.post('/copiloto/index.php/company/estimate_response', sendJson,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (data.message) {
                    set((state) => ({ state: { ...state.state, retornoMessageAPI: data.message } }))
                }
                return true;
            }
            catch (err) {
                return false;
            }
        },
        // RejectedService: async (sendJson: DataRejectedBudget) => {
        //     try {
        //         const { data } = await apiAdmin.post('/copiloto/index.php/company/estimate_reject ', sendJson);
        //         if (data.message) {
        //             set((state) => ({ state: { ...state.state, retornoMessageAPI: data.message } }))
        //         }
        //         console.log(data);
        //     } catch (err) { }
        // },
    }
}))