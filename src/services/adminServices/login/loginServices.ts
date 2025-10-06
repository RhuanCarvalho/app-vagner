import { toast } from 'react-toastify';
import { create } from "zustand";
import { z } from 'zod';
import { apiAdmin } from "@/config/configService";


export const loginSchema = z.object({
    email: z.string().email({ message: 'E-mail inválido' }),
    password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
});
export type LoginFormData = z.infer<typeof loginSchema>;

export interface UserProps {
    id_company: string;
    company_name: string;
    email: string;
    phone_number: string;
    created_at: string;
}

export interface SendDataAuth {
    email: string;
    password: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
    provider: UserProps;
    token: string;
}

interface useUserProps {
    state: {
        loadingAuth: boolean;
        authenticated: boolean;
        user: UserProps | null;
        token: string | null;
    },
    actions: {
        setLoadingAuth: (loading: boolean) => void;
        login: (sendData: SendDataAuth) => Promise<boolean>;
        logout: () => void;
        setAuth: (user: UserProps, token: string) => void;
        initializeAuth: () => void;
    }
}

// Função para salvar no localStorage
const saveAuthToStorage = (user: UserProps, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
};

// Função para remover do localStorage
const removeAuthFromStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

// Função para carregar do localStorage
const loadAuthFromStorage = (): { user: UserProps | null; token: string | null } => {
    if (typeof window === 'undefined') {
        return { user: null, token: null };
    }

    try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userStr && token) {
            const user = JSON.parse(userStr);
            return { user, token };
        }
    } catch (error) {
        console.error('Erro ao carregar autenticação do localStorage:', error);
        removeAuthFromStorage();
    }
    
    return { user: null, token: null };
};

export const useUser = create<useUserProps>((set, get) => ({
    state: {
        authenticated: false,
        loadingAuth: false,
        user: null,
        token: null,
    },
    actions: {
        setLoadingAuth: (loading: boolean) => 
            set((state) => ({ state: { ...state.state, loadingAuth: loading } })),

        login: async (sendData: SendDataAuth) => {
            const { setLoadingAuth, setAuth } = get().actions;
            
            try {
                setLoadingAuth(true);
                
                // Chamada real para a API
                const { data } = await apiAdmin.post<AuthResponse>('/copiloto/index.php/provider/login', {
                    email: sendData.email,
                    senha: sendData.password // Note que o campo é "senha" na API
                });

                if (data.success && data.provider && data.token) {
                    toast.success(data.message || "Login realizado com sucesso!", {
                        draggable: false,
                    });
                    
                    // Salva no state e no localStorage
                    setAuth(data.provider, data.token);
                    return true;
                } else {
                    throw new Error(data.message || "Erro ao fazer login");
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Credenciais incorretas, tente novamente!";
                toast.error(errorMessage);
                return false;
            } finally {
                setLoadingAuth(false);
            }
        },

        logout: () => {
            removeAuthFromStorage();
            set({
                state: {
                    authenticated: false,
                    loadingAuth: false,
                    user: null,
                    token: null,
                }
            });
            toast.success("Logout realizado com sucesso!");
        },

        setAuth: (user: UserProps, token: string) => {
            saveAuthToStorage(user, token);
            // Configura o token no axios para as próximas requisições
            if (apiAdmin.defaults.headers) {
                apiAdmin.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            set({
                state: {
                    authenticated: true,
                    loadingAuth: false,
                    user,
                    token,
                }
            });
        },

        initializeAuth: () => {
            const { user, token } = loadAuthFromStorage();
            
            if (user && token) {
                // Configura o token no axios
                if (apiAdmin.defaults.headers) {
                    apiAdmin.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }

                set({
                    state: {
                        authenticated: true,
                        loadingAuth: false,
                        user,
                        token,
                    }
                });
            }
        }
    }
}));