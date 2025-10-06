import { apiAdmin } from "@/config/configService";
import { categorias, services } from "@/services/fake_data";
import { create } from "zustand";


export interface ServiceProps {
    id_company_service: string;
    service: string;
    categoria: string;
    price: string;
}

export interface CategoriaProps {
    idCategoria: string;
    nome: string;
    icon_white: string;
    icon_gray: string;
}


interface useServicesProps {
    state: {
        services: ServiceProps[];
        selectCategorias: CategoriaProps[]; 
    },
    actions: {
        getServices: () => Promise<void>;
        getCategorias: () => Promise<void>;
    }
}


export const useServices = create<useServicesProps>((set, get) => ({
    state: {
        services: [],
        selectCategorias: [],
    },
    actions: {
        getServices: async () => {
            try {
                // const { data: { data } } = await apiAdmin.get("/copiloto/index.php/provider/services_company")
                // set((state) => ({ state: { ...state.state, services: data } }))
                // Simula delay de rede
                await new Promise(resolve => setTimeout(resolve, 1000));
                set((state) => ({ state: { ...state.state, services: services } }))
            } catch (err) { }
        },
        getCategorias: async () => {
            try {
                // const { data: { data } } = await apiAdmin.get("/copiloto/index.php/provider/categories")
                // set((state) => ({ state: { ...state.state, selectCategorias: data } }))
                // Simula delay de rede
                await new Promise(resolve => setTimeout(resolve, 1000));
                set((state) => ({ state: { ...state.state, selectCategorias: categorias } }))
            } catch (err) { }
        }
    }
}))