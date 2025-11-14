import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_API; 
const TOKEN = process.env.NEXT_PUBLIC_TOKEN;

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`,
    },
    timeout: 10000,
})



export const apiAdmin = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
    timeout: 30000,
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(
    (config) => {
        // Tenta pegar o token do localStorage diretamente
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
    (response) => {
        // Verifica se a resposta tem status 200 mas token expirado
        if (response.data?.expired_token === true) {
            // Token expirado - faz logout
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/admin/login';
            }
            // Rejeita a promise para não propagar a resposta
            return Promise.reject(new Error('Token expirado'));
        }
        return response;
    },
    // (error) => {
    //     // Trata erros HTTP (como 401)
    //     if (error.response?.status === 401) {
    //         handleLogout();
    //     }
    //     return Promise.reject(error);
    // }
);

// Função auxiliar para logout
const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
    }
};