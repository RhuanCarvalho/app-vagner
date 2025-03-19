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