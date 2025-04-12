import { MediaItem } from "@/components/galleryMedias";
import { api } from "@/config/configService";
import { create } from "zustand";

interface DataVerifyCheckin {
    code: string | null | undefined;
    company: string | null | undefined;
    id: string | null | undefined;
    type: string | null | undefined | "estimate" | "schedule";
}

interface Categories {
    id: string;
    categoria:  string;
}

interface Services {
    service: string;
    value: string;
    id_service_item: string;
}

interface AddService {
    id_service:string,
    service: string,
    categoria:string,
    price: string,
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
    services: Services[];
    media: MediaItem[];
    company_name: string;
    company_image: string;
}

interface DataRejectedBudget {
    id: string;
    type: string;
}

interface useCheckinProps {
    state: {
        authenticated: boolean;
        budget: Budget;
        checkinData: DataVerifyCheckin;
        retornoMessageAPI: string;
        categorias: Categories[];
        services: AddService[];
    },
    actions: {
        verifyCodeCheckin: (sendJson: DataVerifyCheckin) => Promise<boolean>;
        sendBudget: (sendJson: any) => Promise<boolean>;
        RejectedService: (sendJson: DataRejectedBudget) => Promise<void>;
        cleanMessage: () => void;
        getCategories: (id: number) => Promise<void>;
        getServices: (id: number, categorie: number) => Promise<void>;
    }
}


export const useAllServices = create<useCheckinProps>((set, get) => ({
    state: {
        authenticated: false,
        budget: {} as Budget,
        checkinData: {} as DataVerifyCheckin,
        retornoMessageAPI: '',
        categorias: [],
        services: [],
    },
    actions: {
        cleanMessage: () => set((state) => ({ state: { ...state.state, retornoMessageAPI: '' } })),
        cleanCategories: () => set((state) => ({ state: { ...state.state, categorias: [] } })),
        verifyCodeCheckin: async (sendJson: DataVerifyCheckin) => {
            try {
                const { data } = await api.post('/copiloto/index.php/company/validate_code', sendJson);
                const response = data.data as Budget;
                if (data.message) {
                    set((state) => ({ state: { ...state.state, retornoMessageAPI: data.message } }))
                }
                set((state) => ({
                    state: {
                        ...state.state,
                        authenticated: data.success,
                        budget: response,
                        checkinData: sendJson,
                    }
                }))
                return data.success;
            } catch (err) {
                return false;
            }
        },
        sendBudget: async (sendJson: any) => {
            try {
                const { data } = await api.post('/copiloto/index.php/company/estimate_response', sendJson,
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
        RejectedService: async (sendJson: DataRejectedBudget) => {
            try {
                const { data } = await api.post('/copiloto/index.php/company/estimate_reject ', sendJson);
                if (data.message) {
                    set((state) => ({ state: { ...state.state, retornoMessageAPI: data.message } }))
                }
                console.log(data);
            } catch (err) { }
        },
        getCategories: async (id: number) => {
            try {
                const { data } = await api.get(`/copiloto/index.php/company/additional_services_category/${id}`)
                set((state) => ({ state: { ...state.state, categorias: data.message } }))
            } catch (err) { }
        },
        getServices: async (id: number, categorie: number) => {
            try{
                const { data } = await api.get(`copiloto/index.php/company/additional_services/${id}/${categorie} `)
                set((state) => ({ state: { ...state.state, services: data.message } }))
            } catch (err) { }
        }
    }
}))