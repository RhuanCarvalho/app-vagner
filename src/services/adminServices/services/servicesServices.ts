import { apiAdmin } from "@/config/configService";
import { create } from "zustand";


export interface ServiceProps {
    id_company_service: string;
    service: string;
    categoria: string;
    price: string;
}


interface useServicesProps {
    state: {
        services: ServiceProps[];
    },
    actions: {
        getServices: () => Promise<void>;
    }
}


export const useServices = create<useServicesProps>((set, get) => ({
    state: {
        services: []
    },
    actions: {
        getServices: async () => {
            try {
                const { data: { data } } = await apiAdmin.get("/copiloto/index.php/provider/services_company")
                set((state) => ({ state: { ...state.state, services: data } }))
            } catch (err) { }
        }
    }
}))