'use client'

import { fakeBudgetsPageBudgets } from "@/fakeData/fakeData";
import { CardBudget } from "./components/Cards";
import { useBudgets } from "@/services/adminServices/budgets/budgetsServices";
import { useEffect, useState } from "react";
import { StatusType } from "./components/Status";

interface BudgetsPageProps {}

export default function BudgetsPage({ }: BudgetsPageProps) {
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [status, setStatus] = useState<1 | 2 | 3 | undefined>(undefined);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    
    const { state: { budgets }, actions: { getBudgets } } = useBudgets();

    useEffect(() => {
        (async () => {
            await getBudgets(page, perPage, status);
        })();
    }, [page, perPage, status])

    const handleApplyFilters = () => {
        setPage(1);
        setShowFilters(false);
    };

    const handleResetFilters = () => {
        setPage(1);
        setPerPage(10);
        setStatus(undefined);
        setShowFilters(false);
    };

    const statusOptions = [
        { value: undefined, label: "Todos os status" },
        { value: 1, label: "Pendente" },
        { value: 2, label: "Resolvido" },
        { value: 3, label: "Cancelado" }
    ];

    const statusMap: Record<number, StatusType> = {
        1: "Pendente",
        2: "Respondido", 
        3: "Cancelado"
    };

    // Calcular informações de paginação
    const totalItems = budgets.length;
    const startItem = totalItems > 0 ? (page - 1) * perPage + 1 : 0;
    const endItem = Math.min(page * perPage, totalItems);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Gerencie todos os orçamentos do sistema
                            </p>
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Conteúdo Principal */}
                    <div className="flex-1 min-w-0">
                        {/* Header com informações */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {totalItems === 0 ? 'Nenhum orçamento encontrado' : 
                                         `${totalItems} orçamento${totalItems !== 1 ? 's' : ''} encontrado${totalItems !== 1 ? 's' : ''}`}
                                    </h2>
                                    {totalItems > 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Mostrando {startItem}-{endItem} de {totalItems} • Página {page} de {Math.ceil(totalItems / perPage)}
                                        </p>
                                    )}
                                </div>
                                
                                {/* Badges dos Filtros Ativos */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Página {page}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {perPage} por página
                                    </span>
                                    {status && (
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {statusOptions.find(opt => opt.value === status)?.label}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Grid de Orçamentos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {budgets.length === 0 ? (
                                <div className="col-span-full">
                                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum orçamento encontrado</h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Tente ajustar os filtros para ver mais resultados.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                budgets.map((bud) => (
                                    <CardBudget 
                                        key={bud.id_orcamento}
                                        index={bud.codigo}
                                        name={bud.car}
                                        services={bud.services.map(serv => serv.service).join(', ')}
                                        status={statusMap[Number(bud.status)] || "Pendente"}
                                    />
                                ))
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
                                            disabled={page === 1}
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
                                            disabled={page >= Math.ceil(totalItems / perPage)}
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
                </div>
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
                                {/* Filtro de Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Status do orçamento
                                    </label>
                                    <select
                                        value={status || ''}
                                        onChange={(e) => setStatus(e.target.value ? Number(e.target.value) as 1 | 2 | 3 : undefined)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value || 'all'} value={option.value || ''}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

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
        </div>
    )
}