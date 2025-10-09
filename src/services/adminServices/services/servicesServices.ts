import { apiAdmin } from "@/config/configService";
import { toast } from "react-toastify";
import { create } from "zustand";


export interface ServiceProps {
    id_company_service: string;
    service: string;
    categoria: string;
    price: string;
}

export interface ServiceSelectProps{
    idservice: string,
    id_categoria: string,
    nome: string
}

export interface CategoriaProps {
    idCategoria: string;
    nome: string;
    icon_white: string;
    icon_gray: string;
}

export interface AddServiceProps {
  service_id: string,
  price: string
}

interface useServicesProps {
    state: {
        services: ServiceProps[];
        selectCategorias: CategoriaProps[]; 
    },
    actions: {
        getServices: () => Promise<void>;
        getCategorias: () => Promise<void>;
        getServicesForSelect: (id_category: string) => Promise<ServiceSelectProps[]>;
        addService: (payload: AddServiceProps) => Promise<void>;
        updateService: (id_company_service: string, payload: {price: string}) => Promise<void>;
        removeService: (id_company_service: string) => Promise<void>;
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
                const { data: { data } } = await apiAdmin.get("/copiloto/index.php/provider/services_company")
                set((state) => ({ state: { ...state.state, services: data } }))
            } catch (err) { }
        },
        getCategorias: async () => {
            try {
                const { data: { data } } = await apiAdmin.get("/copiloto/index.php/provider/categories")
                set((state) => ({ state: { ...state.state, selectCategorias: data } }))
            } catch (err) { }
        },
        getServicesForSelect: async (id_category: string) => {
            try {
                const { data: { data } } = await apiAdmin.get(`/copiloto/index.php/provider/services/${id_category}`)
                return data
            } catch (err) {
                return [] as ServiceSelectProps[]
             }
        },
        addService: async (payload: AddServiceProps) => {
            try {
                const { data } = await apiAdmin.post("/copiloto/index.php/provider/service_company", payload)
                if (data.success){
                    toast.success(data.message)
                }
            }catch (err: any) { 
                toast.error(err.response.data.message)
            }
        },
        updateService: async (id_company_service: string, payload: {price: string}) => {
            try {
                const { data } = await apiAdmin.put(`/copiloto/index.php/provider/service_company/${id_company_service}`, payload)
                if (data.success){
                    toast.success(data.message)
                }
            }catch (err: any) { 
                toast.error(err.response.data.message)
            }
        },
        removeService: async (id_company_service: string) => {
            try {
                const { data } = await apiAdmin.delete(`/copiloto/index.php/provider/service_company/${id_company_service}`)
                if (data.success){
                    toast.success(data.message)
                }
            }catch (err: any) { 
                toast.error(err.response.data.message)
            }
        }
    }
}))