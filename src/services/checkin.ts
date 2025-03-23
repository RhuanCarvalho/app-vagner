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
                
                // const response =  {
                //     status: "1",
                //     label_status: "Aguardando Aprova\u00e7\u00e3o da Oficina",
                //     car: "VERSA SL 1.6 16V FlexStart 4p Aut.",
                //     km: "15000",
                //     genero: "Masculino",
                //     idade: "39",
                //     periodo: "tarde",
                //     approval_expires_at: " dias",
                //     date_schedule: "2025-02-06",
                //     services: [
                //         {
                //             service: "Check-up de f\u00e9rias",
                //             value: "20.00"
                //         },
                //         {
                //             service: "Reparo funilaria",
                //             value: "49.00"
                //         }
                //     ]
                // }
                
                // set((state) => ({
                //     state: {
                //         ...state.state,
                //         authenticated: true,
                //         budget: response,
                //     }
                // }))
                // return true;


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