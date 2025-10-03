// ProviderAuthenticated.tsx
'use client'
import { useUser } from "@/services/adminServices/login/loginServices";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react"
import { toast } from "react-toastify";

interface ProviderAuthenticatedProps {
    children: ReactNode;
}

export const ProviderAuthenticated = ({ children }: ProviderAuthenticatedProps) => {
    const router = useRouter();
    const { state: { authenticated, loadingAuth }, actions: { initializeAuth } } = useUser();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // Inicializa a autenticação
        initializeAuth();
        setAuthChecked(true);
    }, [initializeAuth]);

    useEffect(() => {
        // Só redireciona depois que a autenticação foi verificada
        if (authChecked && !authenticated && !loadingAuth) {
            router.push("/admin/login");
        }
    }, [authenticated, loadingAuth, authChecked, router]);

    // Mostra loading enquanto verifica autenticação
    if (loadingAuth || !authChecked) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            {authenticated ? children : null}
        </>
    )
}