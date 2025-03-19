"use client"
import { useCheckin } from "@/services/checkin"
import { ReactNode } from "react"
import { InvalidPageAccess } from "../invalidPageAccess/InvalidPageAccess"

export const ProviderAuthCheckin = ({ children }: { children: ReactNode }) => {

    const { state: { authenticated } } = useCheckin();

    return (
        <>
            <>{authenticated && children}</>
            <>{!authenticated && <InvalidPageAccess title="Acesso Negado!" description="Solicite um novo Link!" />}</>
        </>
    )
}