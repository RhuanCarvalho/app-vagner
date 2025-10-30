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
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Token expirado ou inválido - faz logout
//             if (typeof window !== 'undefined') {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//                 window.location.href = '/admin/login';
//             }
//         }
//         return Promise.reject(error);
//     }
// );