import { toast } from 'react-toastify';
import { create } from "zustand";
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'E-mail inválido' }),
    password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
});
export type LoginFormData = z.infer<typeof loginSchema>;

export interface UserProps {
    name: string;
    email: string;
}

export interface SendDataAuth {
    email: string;
    password: string;
}

interface useUserProps {
    state: {
        loadingAuth: boolean;
        authenticated: boolean;
        user: UserProps;
    },
    actions: {
        setLoadingAuth: (loading: boolean) => void;
        login: (sendData: SendDataAuth) => Promise<boolean>;
    }
}


export const useUser = create<useUserProps>((set, get) => ({
    state: {
        authenticated: false,
        loadingAuth: false,
        user: {} as UserProps,
    },
    actions: {
        setLoadingAuth: (loading: boolean) => set((state) => ({ state: { ...state.state, loadingAuth: loading } })),
        login: async (sendData: SendDataAuth) => {
            const { setLoadingAuth } = get().actions;
            try {
                setLoadingAuth(true);
                // Simula delay de 5 segundos
                await new Promise(resolve => setTimeout(resolve, 2300));
                if (sendData.email == 'user@email.com' && sendData.password == '123456') {
                    toast.success("Login realizado com sucesso!", {
                        draggable: false,
                    });
                    set((state) => (
                        {
                            state: {
                                ...state.state,
                                user: {
                                    email: "admin@email.com",
                                    name: "Poderoso Chefão"
                                },
                                authenticated: true
                            }
                        }
                    ))
                    return true;
                }
                throw new Error("Credenciais incorretas");
            } catch (err) {
                toast.error("Credenciais incorretas, tente novamente!");
                return false;
            }
            finally {
                setLoadingAuth(false);
            }
        },
    }
}))