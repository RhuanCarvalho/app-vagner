import { MediaItem } from "@/components/galleryMedias";
import { api } from "@/config/configService";
import { create } from "zustand";

interface DataVerifyCheckin {
    code: string | null | undefined;
    company: string | null | undefined;
    id: string | null | undefined;
    type: string | null | undefined | "estimate" | "schedule";
}

interface Services {
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
    services: Services[];
    media: MediaItem[];
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
    },
    actions: {
        verifyCodeCheckin: (sendJson: DataVerifyCheckin) => Promise<boolean>;
        sendBudget: (sendJson: any) => Promise<boolean>;
        RejectedService: (sendJson: DataRejectedBudget) => Promise<void>;
    }
}


export const useAllServices = create<useCheckinProps>((set, get) => ({
    state: {
        authenticated: false,
        budget: {} as Budget,
        checkinData: {} as DataVerifyCheckin,
    },
    actions: {
        verifyCodeCheckin: async (sendJson: DataVerifyCheckin) => {
            try {
                const { data } = await api.post('/copiloto/index.php/company/validate_code', sendJson);
                const response = data.data as Budget;
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
                return true;
            }
            catch (err) {
                return false;
            }
        },
        RejectedService: async (sendJson: DataRejectedBudget) => {
            try {
                const { data } = await api.post('/copiloto/index.php/company/estimate_reject ', sendJson);
                console.log(data);
            } catch (err) { }
        } 
    }
}))