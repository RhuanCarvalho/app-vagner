'use client'
import { useUser } from "@/services/adminServices/login/loginServices";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react"
import { toast } from "react-toastify";

interface ProviderAuthenticatedProps {
    children: ReactNode;
}

export const ProviderAuthenticated = ({ children }: ProviderAuthenticatedProps) => {

    const router = useRouter();
    const { state: { authenticated } } = useUser();
    useEffect(()=> {
        if (!authenticated) {
            toast.warning("Necessário autenticação!")
            router.push("/admin/login")
        }
    },[])
    return (
        <>
            {authenticated && children}
            {!authenticated && null}
            {/* {children} */}
        </>
    )
}