"use client"

import { useAllServices } from "@/services/allServices"

export const HeaderTemplate = () => {

    const { state: { budget } } = useAllServices()

    const company_img = !!budget.company_image ? budget.company_image : '/painel/link/default-avatar.png'
    const company_name = !!budget.company_name ? budget.company_name : 'Nome_Empresa'

    return (
        <div className="w-full px-5 pt-10 pb-5 flex flex-col">
            <div>
                <h2 className="text-blue-500 font-extrabold text-xl">Olá 👋</h2>
            </div>
            <div className="w-full flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-blue-950">{company_name}</h1>
                <img className="w-16 h-16 rounded-full" src={company_img} alt="avatar" />
            </div>
        </div>
    )
}