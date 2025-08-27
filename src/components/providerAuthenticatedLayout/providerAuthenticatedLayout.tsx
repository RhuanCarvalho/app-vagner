'use client'
import { ReactNode, useEffect, useState } from "react"
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { useRouter, usePathname } from "next/navigation";

export interface itensProps {
    label: string;
    value: string;
    icon: any;
}

interface ProviderAuthenticatedLayoutProps {
    children: ReactNode;
    itens: itensProps[];

}

export const ProviderAuthenticatedLayout = ({ children, itens }: ProviderAuthenticatedLayoutProps) => {

    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [itemSelect, setItemSeleted] = useState<itensProps>({} as itensProps);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // ao montar, verifica se a rota atual contém o value de algum item
        const found = itens.find(item => pathname.includes(item.value));
        if (found) {
            setItemSeleted(found);
        }
    }, [pathname, itens]);

    const nagivateTo = (item: itensProps) => {
        router.push(`/admin/${item.value}`)
        setItemSeleted(item)
    }
    return (
        <div className="h-full">
            <header className="bg-[#002547] h-12 flex justify-start pl-5">
                <img className="w-8" src="/capacete.svg" alt="" />
            </header>
            <div style={{
                height: 'calc(100% - 3.5rem)'
            }} className="flex h-full">

                {/*Menu */}
                <div className={`w-max flex flex-col p-4 gap-1 justify-start relative shadow-slate-200 shadow-lg pt-10`}>
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="cursor-pointer bg-white shadow-slate-400 shadow z-50 absolute p-2 rounded-full -right-4 top-2 hover:scale-105 transition-all "
                    >
                        <ArrowRightIcon className={`size-4 transition-all ${isOpen ? '-rotate-180' : ''}`} />
                    </div>
                    {itens.map(item => (
                        <div
                            key={item.value}
                            onClick={() => nagivateTo(item)}
                            className={`${item.value == itemSelect.value && "bg-gray-200"} cursor-pointer flex items-center justify-start gap-2 p-2 rounded-lg hover:scale-105 transition-all hover:bg-[#01346445]`}>
                            {item.icon}
                            {isOpen && <p className={`${!isOpen && 'hidden'} text-gray-500 font-semibold text-xs pr-4 transition-all`}>{item.label}</p>}

                        </div>
                    ))}
                </div>

                {/*Conteudo */}
                <div className="w-full pl-[20px] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}