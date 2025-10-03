'use client'
import { ReactNode, useEffect, useState } from "react"
import { ArrowRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/solid'
import { useUser } from "@/services/adminServices/login/loginServices";


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
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [itemSelect, setItemSeleted] = useState<itensProps>({} as itensProps);

    const router = useRouter();
    const pathname = usePathname();

    const {actions: { logout }} = useUser();

    const handleLogout = () => {
        logout();
        router.push(`/admin/login`)
    }

    // Carregar estado do localStorage ao montar o componente
    useEffect(() => {
        const savedIsOpen = localStorage.getItem('sidebar-open');
        if (savedIsOpen !== null) {
            setIsOpen(JSON.parse(savedIsOpen));
        }
    }, []);

    // Salvar estado no localStorage sempre que isOpen mudar
    useEffect(() => {
        localStorage.setItem('sidebar-open', JSON.stringify(isOpen));
    }, [isOpen]);

    useEffect(() => {
        // ao montar, verifica se a rota atual contém o value de algum item
        const found = itens.find(item => pathname.includes(item.value));
        if (found) {
            setItemSeleted(found);
        }
    }, [pathname, itens]);

    const nagivateTo = (item: itensProps) => {
        router.push(`/admin/${item.value}`)
        setItemSeleted(item);
        // Fechar menu mobile após clicar em um item
        setIsMobileMenuOpen(false);
    }

    // Fechar menu mobile ao redimensionar para desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="h-full">
            <header className="bg-[#002547] h-12 flex justify-between items-center px-5 md:justify-start md:pl-5">
                <div className="flex items-center gap-3">
                    <img className="w-8" src="/capacete.svg" alt="" />
                    {/* Mostrar label do item selecionado no mobile */}
                    <span className="text-white text-sm font-medium md:hidden">
                        {itemSelect.label}
                    </span>
                </div>

                {/* Botão hamburguer para mobile */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-1 text-white hover:bg-[#013464] rounded transition-colors"
                >
                    {isMobileMenuOpen ? (
                        <XMarkIcon className="size-6" />
                    ) : (
                        <Bars3Icon className="size-6" />
                    )}
                </button>
            </header>

            <div style={{
                height: 'calc(100% - 3.5rem)'
            }} className="flex h-full">

                {/* Menu Lateral - Desktop */}
                <div className={`hidden md:flex md:flex-col p-4 gap-1 justify-between relative shadow-slate-200 shadow-lg pt-10`}>
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="cursor-pointer bg-white shadow-slate-400 shadow z-50 absolute p-2 rounded-full -right-4 top-2 hover:scale-105 transition-all "
                    >
                        <ArrowRightIcon className={`size-4 transition-all ${isOpen ? '-rotate-180' : ''}`} />
                    </div>
                    <div>
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
                    <div
                        onClick={handleLogout}
                        className={`cursor-pointer flex items-center justify-start gap-2 p-2 rounded-lg hover:scale-105 transition-all hover:bg-[#01346445]`}>
                        <ArrowLeftEndOnRectangleIcon
                            className="size-5 text-gray-500"
                        />
                        {isOpen && <p className={`${!isOpen && 'hidden'} text-gray-500 font-semibold text-xs pr-4 transition-all`}>Sair</p>}
                    </div>
                </div>

                {/* Menu Mobile - Tela Cheia */}
                <div className={`
                    fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:hidden flex flex-col
                `}>
                    {/* Header do Menu Mobile */}
                    <div className="bg-[#002547] h-12 flex justify-between items-center px-5 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <img className="w-8" src="/capacete.svg" alt="Logo" />
                            <span className="text-white text-sm font-medium">Menu</span>
                        </div>

                        {/* Botão X para fechar o menu */}
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 text-white hover:bg-[#013464] rounded-full transition-colors"
                        >
                            <XMarkIcon className="size-6" />
                        </button>
                    </div>

                    {/* Lista de Itens do Menu - Mesmo padrão do desktop */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex flex-col">
                                {itens.map(item => (
                                    <div
                                        key={item.value}
                                        onClick={() => nagivateTo(item)}
                                        className={`${item.value == itemSelect.value && "bg-gray-200"} cursor-pointer flex items-center justify-start gap-2 p-2 rounded-lg hover:scale-105 transition-all hover:bg-[#01346445]`}>
                                        {item.icon}
                                        <p className="flex-1 text-gray-500 font-semibold text-lg pr-4 transition-all">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div
                                onClick={handleLogout}
                                className={`pb-10 cursor-pointer flex items-center justify-start gap-2 p-2 rounded-lg hover:scale-105 transition-all hover:bg-[#01346445]`}>
                                <ArrowLeftEndOnRectangleIcon
                                    className="size-5 text-gray-500"
                                />
                                <p className="flex-1 text-gray-500 font-semibold text-lg pr-4 transition-all">Sair</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conteudo */}
                <div className="w-full pl-0 md:pl-[20px] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}