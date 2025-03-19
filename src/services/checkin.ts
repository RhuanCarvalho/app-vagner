import { api } from "@/config/configService";
import { create } from "zustand";

interface DataVerifyCheckin {
    code: string | null | undefined;
    company: string | null | undefined;
    id: string | null | undefined;
    type: string | null | undefined;
}

interface Services {
    service: string;
    value: string;
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
}

interface useCheckinProps {
    state: {
        authenticated: boolean;
        budget: Budget;
    },
    actions: {
        verifyCodeCheckin: (sendJson: DataVerifyCheckin) => Promise<boolean>;
    }
}


export const useCheckin = create<useCheckinProps>((set, get) => ({
    state: {
        authenticated: false,
        budget: {} as Budget,
    },
    actions: {
        verifyCodeCheckin: async (sendJson: DataVerifyCheckin) => {
            try {
                const { data } = await api.post('/copiloto/index.php/company/validate_code', sendJson);
                const response = data.data as Budget;
                console.log(data);
                set((state) => ({
                    state: {
                        ...state.state,
                        authenticated: data.success,
                        budget: response,
                    }
                }))
                return true;
            } catch (err) {
                return false;
            }
        },
    }
}))