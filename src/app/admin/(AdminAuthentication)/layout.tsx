import { ProviderAuthenticated } from "@/components/providerAuthenticated/providerAuthenticated";
import { itensProps, ProviderAuthenticatedLayout } from "@/components/providerAuthenticatedLayout/providerAuthenticatedLayout";
import { ReactNode } from "react";
// import { CalendarDaysIcon } from "lucide-react";
import { CalendarDaysIcon, CalendarIcon, ClipboardDocumentListIcon, BanknotesIcon, HomeIcon } from '@heroicons/react/24/solid'

export default function AdminLayout(
    { children }: { children: ReactNode }
) {

    const menu: itensProps[] = [
        {
            value: 'home',
            icon: <HomeIcon
            className="size-5 text-gray-500"
            />,
            label: 'Home'
        },
        {
            value: 'budgets',
            icon: <BanknotesIcon
            className="size-5 text-gray-500"
            />,
            label: 'Orçamentos'
        },
        {
            value: 'schedules',
            icon: <CalendarIcon
                className="size-5 text-gray-500"
            />,
            label: 'Agendamento'
        },
        {
            value: 'schedule',
            icon: <CalendarDaysIcon
                className="size-5 text-gray-500"
            />,
            label: 'Agenda'
        },
        {
            value: 'services',
            icon: <ClipboardDocumentListIcon
                className="size-5 text-gray-500"
            />,
            label: 'Serviços'
        },
    ]


    return (
        <>
            <ProviderAuthenticated>
                <ProviderAuthenticatedLayout itens={menu} >
                    {children}
                </ProviderAuthenticatedLayout>
            </ProviderAuthenticated>
        </>
    )
}