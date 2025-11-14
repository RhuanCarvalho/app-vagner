'use client'

import { CardBudget } from "./components/Cards";
import { BudgetsProps, useBudgets } from "@/services/adminServices/budgets/budgetsServices";
import { useEffect, useState } from "react";
import { useUser } from "@/services/adminServices/login/loginServices";
import { OpenBudget } from "./openBudget/openBudget";

export type StatusTypeGroup = 
  | "Aguardando retorno do prestador"
  | "Aguardando confirmação do cliente" 
  | "Concluídos";

interface BudgetsPageProps { }

export default function BudgetsPage({ }: BudgetsPageProps) {
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [status, setStatus] = useState<777 | 888 | 999>(777);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [activeStatus, setActiveStatus] = useState<StatusTypeGroup>('Aguardando retorno do prestador');
    const [loading, setLoading] = useState<boolean>(false);

    const { state: { budgets }, actions: { getBudgets, setBudgetOpen } } = useBudgets();
    const { state: { user } } = useUser();

    useEffect(() => {
        (async () => {
            setLoading(true);
            await getBudgets(page, perPage, status);
            setLoading(false);
        })();
    }, [page, perPage, status])

    const handleApplyFilters = () => {
        setPage(1);
        setShowFilters(false);
    };

    const handleResetFilters = () => {
        setPage(1);
        setPerPage(10);
        setStatus(777);
        setShowFilters(false);
        setActiveStatus('Aguardando retorno do prestador');
    };

    // Definir os status conforme fornecido
    const statusOptions = [
        { value: 777, label: "Aguardando retorno do prestador" },
        { value: 888, label: "Aguardando confirmação do cliente" },
        { value: 999, label: "Concluídos" }
    ];

    const statusMap: Record<number, StatusTypeGroup> = {
        777: "Aguardando retorno do prestador",
        888: "Aguardando confirmação do cliente",
        999: "Concluídos"
    };

    // Função para lidar com clique nos botões de status
    const handleStatusClick = async (selectedStatus: StatusTypeGroup) => {
        setLoading(true);
        setActiveStatus(selectedStatus);
        setPage(1);

        // Mapeia o texto do status para o valor numérico da API
        const statusMapToApi: Record<StatusTypeGroup, 777 | 888 | 999> = {
            "Aguardando retorno do prestador": 777,
            "Aguardando confirmação do cliente": 888,
            "Concluídos": 999,
        };

        const apiStatus = statusMapToApi[selectedStatus];
        setStatus(apiStatus);
        await getBudgets(1, perPage, apiStatus);
        setLoading(false);
    };

    // Calcular informações de paginação
    const totalItems = budgets.length;
    const startItem = totalItems > 0 ? (page - 1) * perPage + 1 : 0;
    const endItem = Math.min(page * perPage, totalItems);

    // Definir cores para cada status
    const statusColumns = [
        { key: "Aguardando retorno do prestador" as StatusTypeGroup, title: "Aguardando retorno do prestador", count: budgets.length, color: "bg-yellow-50 border-yellow-200" },
        { key: "Aguardando confirmação do cliente" as StatusTypeGroup, title: "Aguardando confirmação do cliente", count: budgets.length, color: "bg-blue-50 border-blue-200" },
        { key: "Concluídos" as StatusTypeGroup, title: "Concluídos", count: budgets.length, color: "bg-green-50 border-green-200" },
    ];

    // Coluna ativa (agora só mostra uma coluna por vez)
    const activeColumn = statusColumns.find(column => column.key === activeStatus);

    const [openBudget, setOpenBudget] = useState<boolean>(false);
    const handleOpenBudget = async (budget: BudgetsProps) => {
        setBudgetOpen(budget,
            {
                code:'',
                company: user?.id_company,
                id: '',
                id_estimate_service: budget.id_orcamento,
                type: budget.type,
            }
        )
        setOpenBudget(true);
    }

    return (
        <div className="min-h-screen ">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6 max-md:flex-col max-md:items-start max-md:gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Gerencie todos os orçamentos do sistema
                            </p>
                        </div>
                        <div className="flex justify-end gap-4 max-md:justify-between max-md:w-full">
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Página {page}
                                </span>
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {perPage} por página
                                </span>
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {statusOptions.find(opt => opt.value === status)?.label}
                                </span>
                            </div>
                            {/* Botão Filtro - Mobile e Desktop */}
                            <button
                                onClick={() => setShowFilters(true)}
                                className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filtros
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto px-3 sm:px-3 lg:px-5 py-5">
                {/* Loading State */}
                {loading && (
                    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="text-gray-700">Carregando...</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile - Filtros de Status em Abas */}
                <div className="lg:hidden mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-700">Filtrar por status:</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {/* Botões por Status */}
                                {statusColumns.map((column) => (
                                    <button
                                        key={column.key}
                                        onClick={() => handleStatusClick(column.key)}
                                        disabled={loading}
                                        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${activeStatus === column.key
                                            ? `${column.color.replace('bg-', 'border-').replace('-50', '-500')} ${column.color}`
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <span className={`text-sm font-medium ${activeStatus === column.key
                                            ? `text-${column.color.includes('yellow') ? 'yellow' : column.color.includes('blue') ? 'blue' : column.color.includes('green') ? 'green' : 'orange'}-700`
                                            : 'text-gray-700'
                                            }`}>
                                            {column.title}
                                        </span>
                                        {activeStatus === column.key &&
                                            <span className={`px-2 py-1 rounded-full text-xs ${activeStatus === column.key
                                                ? `bg-${column.color.includes('yellow') ? 'yellow' : column.color.includes('blue') ? 'blue' : column.color.includes('green') ? 'green' : 'orange'}-100 text-${column.color.includes('yellow') ? 'yellow' : column.color.includes('blue') ? 'blue' : column.color.includes('green') ? 'green' : 'orange'}-800`
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {column.count}
                                            </span>
                                        }
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop - Filtros de Status */}
                <div className="hidden lg:block mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-700">Filtrar por status:</h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {/* Botões por Status */}
                                {statusColumns.map((column) => (
                                    <button
                                        key={column.key}
                                        onClick={() => handleStatusClick(column.key)}
                                        disabled={loading}
                                        className={`flex items-center justify-between px-4 py-2 rounded-lg border-2 transition-all ${activeStatus === column.key
                                            ? `${column.color.replace('bg-', 'border-').replace('-50', '-500')} ${column.color}`
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <span className={`text-sm font-medium ${activeStatus === column.key
                                            ? `text-${column.color.includes('yellow') ? 'yellow' : column.color.includes('blue') ? 'blue' : column.color.includes('green') ? 'green' : 'orange'}-700`
                                            : 'text-gray-700'
                                            }`}>
                                            {column.title}
                                        </span>
                                        {activeStatus === column.key &&
                                            <span className={`px-2 py-1 rounded-full text-xs ml-2 ${activeStatus === column.key
                                                ? `bg-${column.color.includes('yellow') ? 'yellow' : column.color.includes('blue') ? 'blue' : column.color.includes('green') ? 'green' : 'orange'}-100 text-${column.color.includes('yellow') ? 'yellow' : column.color.includes('blue') ? 'blue' : column.color.includes('green') ? 'green' : 'orange'}-800`
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {column.count}
                                            </span>
                                        }
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile - Grid de Cards */}
                <div className="lg:hidden">
                    {budgets.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                {`Nenhum orçamento ${activeStatus.toLowerCase()}`}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Não há orçamentos com este status no momento.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {budgets.map((bud) => (
                                <CardBudget
                                    key={bud.id_orcamento}
                                    index={bud.codigo}
                                    name={bud.car}
                                    services={bud.services.map(serv => serv.service).join(', ')}
                                    status={bud.label_status}
                                    concorrencia={bud.concorrencia}
                                    onClick={() => handleOpenBudget(bud)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Versão Desktop - Kanban */}
                <div className="hidden lg:block">
                    {budgets.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                {`Nenhum orçamento ${activeStatus.toLowerCase()}`}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Não há orçamentos com este status no momento.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 grid-cols-1">
                            {activeColumn && (
                                <div className="flex flex-col">
                                    {/* Cards da coluna */}
                                    <div className="space-y-4 flex-1">
                                        {budgets.map((bud) => (
                                            <CardBudget
                                                key={bud.id_orcamento}
                                                index={bud.codigo}
                                                name={bud.car}
                                                services={bud.services.map(serv => serv.service).join(', ')}
                                                status={bud.label_status}
                                                concorrencia={bud.concorrencia}
                                                onClick={() => handleOpenBudget(bud)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Paginação */}
                {totalItems > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                Mostrando <span className="font-semibold">{startItem}-{endItem}</span> de <span className="font-semibold">{totalItems}</span> orçamentos
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={page === 1 || loading}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Anterior
                                </button>

                                <span className="text-sm text-gray-600 min-w-20 text-center">
                                    Página <span className="font-semibold">{page}</span>
                                </span>

                                <button
                                    onClick={() => setPage(prev => prev + 1)}
                                    disabled={page >= Math.ceil(totalItems / perPage) || loading}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Próxima
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Filtros - Com fundo esfumaçado */}
            {showFilters && (
                <>
                    {/* Overlay esfumaçado */}
                    <div
                        className="fixed inset-0 bg-white/80 backdrop-blur-md z-40 transition-all"
                        onClick={() => setShowFilters(false)}
                    />

                    {/* Modal */}
                    <div className={`
                        fixed z-50 bg-white
                        transition-all duration-300 ease-in-out
                        
                        /* Mobile */
                        inset-0
                        
                        /* Desktop */
                        lg:inset-auto lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2
                        lg:rounded-2xl lg:shadow-2xl lg:border lg:border-gray-200
                        lg:w-full lg:max-w-lg lg:max-h-[85vh] lg:overflow-hidden
                    `}>
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                            <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Conteúdo com scroll */}
                        <div className="p-6 overflow-y-auto max-h-[calc(100vh-140px)] lg:max-h-[calc(85vh-80px)]">
                            <div className="space-y-6">

                                {/* Filtro de Itens por Página */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Itens por página
                                    </label>
                                    <select
                                        value={perPage}
                                        onChange={(e) => setPerPage(Number(e.target.value))}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                    >
                                        <option value="5">5 itens</option>
                                        <option value="10">10 itens</option>
                                        <option value="20">20 itens</option>
                                        <option value="50">50 itens</option>
                                    </select>
                                </div>

                                {/* Filtro de Página */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Página atual
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={page}
                                        onChange={(e) => setPage(Math.max(1, Number(e.target.value)))}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer com botões */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleApplyFilters}
                                    className="flex-1 bg-[#002547] text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Aplicar Filtros
                                </button>
                                <button
                                    onClick={handleResetFilters}
                                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {openBudget &&
                <OpenBudget  isOpen={openBudget} closeInX={() => setOpenBudget(false)}/>
            }
        </div>
    )
}