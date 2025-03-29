"use client"
import { useAllServices } from "@/services/allServices"
import { ReactNode } from "react"
import { InvalidPageAccess } from "../invalidPageAccess/InvalidPageAccess"

export const ProviderAuthCheckin = ({ children }: { children: ReactNode }) => {

    const { state: { authenticated } } = useAllServices();

    return (
        <>
            <>{authenticated && children}</>
            <>{!authenticated && <InvalidPageAccess title="Acesso Negado!" description="Solicite um novo Link!" />}</>
        </>
    )
}