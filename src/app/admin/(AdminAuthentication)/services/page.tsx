"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Package, Edit, Save, X, ChevronUp, Trash2, Search } from "lucide-react"
import { ServiceProps, ServiceSelectProps, useServices } from "@/services/adminServices/services/servicesServices"
import { SelectWithSearch } from "@/components/ui/SelectWithSearch"

interface AddServiceProps {
    service: string;
    categoria: string;
    price: string;
}

const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor)
}

// Função para remover pontuações e acentos
const normalizarTexto = (texto: string): string => {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[.,^~\-´`'"]/g, '') // Remove pontuações específicas
        .replace(/[^\w\s]/gi, '') // Remove qualquer outro caractere especial
        .toLowerCase()
        .trim();
}

export default function ProdutosPage() {

    const {
        state: { services, selectCategorias },
        actions: {
            getServices,
            getCategorias,
            getServicesForSelect,
            addService,
            updateService,
            removeService
        }
    } = useServices();

    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [novoProduto, setNovoProduto] = useState<AddServiceProps>({ service: "", price: "", categoria: "" })
    const [editandoProduto, setEditandoProduto] = useState<string | null>(null)
    const [produtoEditado, setProdutoEditado] = useState<AddServiceProps>({ service: "", price: "", categoria: "" })
    const [filtro, setFiltro] = useState("")
    const [serviceOptions, setServiceOptions] = useState<{ value: string; label: string }[]>([])
    const [loadingServices, setLoadingServices] = useState(false)

    // Converter categorias para o formato do SelectWithSearch
    const categoriaOptions = selectCategorias.map(categoria => ({
        value: categoria.idCategoria,
        label: categoria.nome
    }))

    // Função para carregar serviços baseado na categoria selecionada
    const carregarServicosPorCategoria = async (categoria_id: string) => {
        if (!categoria_id) {
            setServiceOptions([])
            return
        }

        setLoadingServices(true)
        try {
            const servicesData: ServiceSelectProps[] = await getServicesForSelect(categoria_id)
            const options = servicesData.map((service: ServiceSelectProps) => ({
                value: service.idservice,
                label: service.nome
            }))
            setServiceOptions(options)
        } catch (error) {
            console.error("Erro ao carregar serviços:", error)
            setServiceOptions([])
        } finally {
            setLoadingServices(false)
        }
    }

    // Função para lidar com mudança de categoria
    const handleCategoriaChange = (categoria_id: string) => {
        setNovoProduto({
            ...novoProduto,
            categoria: categoria_id,
            service: "",
            price: ""
        })

        if (categoria_id) {
            carregarServicosPorCategoria(categoria_id)
        } else {
            setServiceOptions([])
        }
    }

    // Função para lidar com mudança de serviço
    const handleServiceChange = (service: string) => {
        setNovoProduto({
            ...novoProduto,
            service,
            price: ""
        })
    }

    // Função para filtrar os serviços
    const servicosFiltrados = services.filter((produto) => {
        if (!filtro.trim()) return true;

        const termoBusca = normalizarTexto(filtro);

        // Normaliza os dados do produto para comparação
        const idNormalizado = normalizarTexto(produto.id_company_service);
        const serviceNormalizado = normalizarTexto(produto.service);
        const categoriaNormalizada = normalizarTexto(produto.categoria);
        const priceNormalizado = normalizarTexto(produto.price);
        const valorFormatadoNormalizado = normalizarTexto(formatarValor(Number(produto.price)));

        return (
            idNormalizado.includes(termoBusca) ||
            serviceNormalizado.includes(termoBusca) ||
            categoriaNormalizada.includes(termoBusca) ||
            priceNormalizado.includes(termoBusca) ||
            valorFormatadoNormalizado.includes(termoBusca)
        );
    });

    const adicionarProduto = async () => {
        if (!novoProduto.service || !novoProduto.price || !novoProduto.categoria) {
            alert("Preencha todos os campos obrigatórios");
            return;
        }

        try {
            const payload = {
                service_id: novoProduto.service,
                price: novoProduto.price
            };

            await addService(payload);

            // Limpar formulário após adicionar
            setNovoProduto({ service: "", price: "", categoria: "" });
            setServiceOptions([]);

            // Recarregar a lista de serviços
            await getServices();

        } catch (error) {
        }
    }

    const iniciarEdicao = (produto: ServiceProps) => {
        setEditandoProduto(produto.id_company_service)
        setProdutoEditado({
            service: produto.service,
            price: produto.price,
            categoria: produto.categoria
        })
    }

    const salvarEdicao = async () => {
        if (!editandoProduto || !produtoEditado.price) {
            alert("Preço é obrigatório");
            return;
        }

        try {
            const payload = {
                price: produtoEditado.price
            };

            await updateService(editandoProduto, payload);

            // Limpar estado de edição
            setEditandoProduto(null);
            setProdutoEditado({ service: "", price: "", categoria: "" });

            // Recarregar a lista de serviços
            await getServices();

        } catch (error) {
        }
    }

    const cancelarEdicao = () => {
        setEditandoProduto(null)
        setProdutoEditado({ service: "", price: "", categoria: "" })
    }

    const excluirProduto = async (id: string) => {
        await removeService(id);
        // Recarregar a lista de serviços
        await getServices();
    }

    const limparFiltro = () => {
        setFiltro("")
    }

    // Resetar estados quando fechar o formulário
    useEffect(() => {
        if (!mostrarFormulario) {
            setNovoProduto({ service: "", price: "", categoria: "" })
            setServiceOptions([])
        }
    }, [mostrarFormulario])

    // Carrega categorias quando o formulário é aberto
    useEffect(() => {
        if (mostrarFormulario || editandoProduto) {
            getCategorias();
        }
    }, [mostrarFormulario, editandoProduto, getCategorias])

    useEffect(() => {
        (async () => getServices())();
    }, [])

    return (
        <div className="min-h-screen bg-white">
            {/* Header igual ao da agenda */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Desktop: título e botão lado a lado */}
                    <div className="hidden md:flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Gerencie todos os serviços do sistema
                            </p>
                        </div>
                        <Button
                            onClick={() => setMostrarFormulario(!mostrarFormulario)}
                            className="flex items-center gap-2 bg-[#002547] text-white"
                        >
                            {mostrarFormulario ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4 text-white" />}
                            {mostrarFormulario ? "Cancelar" : "Adicionar Serviço"}
                        </Button>
                    </div>

                    {/* Mobile: título e botão em coluna */}
                    <div className="md:hidden py-6">
                        <div className="mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Gerencie todos os serviços do sistema
                            </p>
                        </div>
                        <Button
                            onClick={() => setMostrarFormulario(!mostrarFormulario)}
                            className="flex items-center gap-2 bg-[#002547] text-white w-full"
                        >
                            {mostrarFormulario ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4 text-white" />}
                            {mostrarFormulario ? "Cancelar" : "Adicionar Serviço"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Adicionar serviço */}
                {mostrarFormulario && (
                    <div className="bg-gray-100 rounded-lg p-4 sm:p-6 mb-6 border">
                        <h3 className="text-lg font-semibold mb-4">Novo Serviço</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="categoria">Categoria</Label>
                                <SelectWithSearch
                                    options={categoriaOptions}
                                    value={novoProduto.categoria}
                                    onValueChange={handleCategoriaChange}
                                    placeholder="Selecione uma categoria"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="service">Serviço</Label>
                                <SelectWithSearch
                                    options={serviceOptions}
                                    value={novoProduto.service}
                                    onValueChange={handleServiceChange}
                                    placeholder={
                                        loadingServices
                                            ? "Carregando serviços..."
                                            : !novoProduto.categoria
                                                ? "Selecione uma categoria primeiro"
                                                : "Selecione um serviço"
                                    }
                                    disabled={!novoProduto.categoria || loadingServices}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="valor">Valor (R$)</Label>
                                <Input
                                    id="valor"
                                    type="number"
                                    step="0.01"
                                    placeholder="0,00"
                                    value={novoProduto.price}
                                    onChange={(e) => setNovoProduto({ ...novoProduto, price: e.target.value })}
                                    disabled={!novoProduto.service}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <Button
                                onClick={adicionarProduto}
                                disabled={!novoProduto.service || !novoProduto.price || !novoProduto.categoria}
                                className="bg-[#002547] text-white sm:flex-1"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setMostrarFormulario(false)
                                    setNovoProduto({ service: "", price: "", categoria: "" })
                                    setServiceOptions([])
                                }}
                                className="sm:flex-1"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Filtro de busca */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Buscar por ID, nome, categoria ou valor..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="pl-10 pr-10"
                        />
                        {filtro && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={limparFiltro}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                    {filtro ? (
                        <p className="text-sm text-muted-foreground mt-2">
                            {servicosFiltrados.length} serviço{servicosFiltrados.length !== 1 ? 's' : ''} encontrado{servicosFiltrados.length !== 1 ? 's' : ''}
                            {servicosFiltrados.length !== services.length && ` de ${services.length}`}
                        </p>
                    ) : <p className="text-sm text-muted-foreground mt-2">Digite para filtrar...</p>
                    }
                </div>

                {servicosFiltrados.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-lg">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {filtro ? "Nenhum serviço encontrado" : "Nenhum serviço cadastrado"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {filtro ? "Tente ajustar os termos da busca" : "Comece adicionando seu primeiro serviço"}
                        </p>
                        {filtro && (
                            <Button variant="outline" onClick={limparFiltro}>
                                Limpar busca
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="rounded-md border overflow-hidden">
                        {/* Table para desktop */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">ID</TableHead>
                                        <TableHead>Nome do Serviço</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead className="text-right">Valor</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {servicosFiltrados.map((produto) => (
                                        <TableRow key={produto.id_company_service} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">{produto.id_company_service}</TableCell>
                                            <TableCell>
                                                {editandoProduto === produto.id_company_service ? (
                                                    <span className="text-foreground">
                                                        {produto.service}
                                                    </span>
                                                ) : (
                                                    <span className="text-foreground">
                                                        {produto.service}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editandoProduto === produto.id_company_service ? (
                                                    <span className="text-foreground">
                                                        {produto.categoria}
                                                    </span>
                                                ) : (
                                                    <span className="text-foreground">
                                                        {produto.categoria}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {editandoProduto === produto.id_company_service ? (
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={produtoEditado.price}
                                                        onChange={(e) => setProdutoEditado({ ...produtoEditado, price: e.target.value })}
                                                        className="max-w-[120px] ml-auto"
                                                    />
                                                ) : (
                                                    <span
                                                        className="cursor-pointer hover:text-primary transition-colors font-semibold"
                                                        onClick={() => iniciarEdicao(produto)}
                                                    >
                                                        {formatarValor(Number(produto.price))}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editandoProduto === produto.id_company_service ? (
                                                    <div className="flex gap-1">
                                                        <Button className="bg-[#002547] text-white" size="sm" onClick={salvarEdicao}>
                                                            <Save className="h-3 w-3" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={cancelarEdicao}>
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-1">
                                                        <Button size="sm" variant="ghost" onClick={() => iniciarEdicao(produto)}>
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => excluirProduto(produto.id_company_service)}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-3 w-3 text-red-600" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Cards para mobile */}
                        <div className="md:hidden">
                            <div className="divide-y">
                                {servicosFiltrados.map((produto) => (
                                    <div key={produto.id_company_service} className="p-4 hover:bg-muted/50">
                                        {/* Primeira linha: ID e Categoria */}
                                        <div className="grid grid-cols-2 gap-4 mb-3 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-medium text-muted-foreground block mb-1">
                                                    ID
                                                </span>
                                                <span className="font-medium">{produto.id_company_service}</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-medium text-muted-foreground block mb-1">
                                                    Categoria
                                                </span>
                                                {editandoProduto === produto.id_company_service ? (
                                                    <span className="text-foreground block">
                                                        {produto.categoria}
                                                    </span>
                                                ) : (
                                                    <span className="text-foreground block">
                                                        {produto.categoria}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Segunda linha: Serviço e Valor */}
                                        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-medium text-muted-foreground block mb-1">
                                                    Serviço
                                                </span>
                                                {editandoProduto === produto.id_company_service ? (
                                                    <span className="text-foreground block">
                                                        {produto.service}
                                                    </span>
                                                ) : (
                                                    <span className="text-foreground block">
                                                        {produto.service}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-medium text-muted-foreground block mb-1">
                                                    Valor
                                                </span>
                                                {editandoProduto === produto.id_company_service ? (
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={produtoEditado.price}
                                                        onChange={(e) => setProdutoEditado({ ...produtoEditado, price: e.target.value })}
                                                        className="w-full text-center"
                                                    />
                                                ) : (
                                                    <span
                                                        className="cursor-pointer hover:text-primary transition-colors font-semibold block"
                                                        onClick={() => iniciarEdicao(produto)}
                                                    >
                                                        {formatarValor(Number(produto.price))}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Ações centralizadas */}
                                        <div className="flex justify-center gap-8">
                                            {editandoProduto === produto.id_company_service ? (
                                                <>
                                                    <Button className="bg-[#002547] text-white" size="sm" onClick={salvarEdicao}>
                                                        <Save className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={cancelarEdicao}>
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button size="sm" variant="ghost" onClick={() => iniciarEdicao(produto)}>
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => excluirProduto(produto.id_company_service)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-3 w-3 text-red-600" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {servicosFiltrados.length > 0 && (
                    <div className="mt-6 text-center text-muted-foreground">
                        <p>
                            {servicosFiltrados.length} serviço{servicosFiltrados.length !== 1 ? "s" : ""}
                            {filtro ? " encontrado" : " cadastrado"}{servicosFiltrados.length !== 1 ? "s" : ""}
                            {filtro && servicosFiltrados.length !== services.length && ` de ${services.length}`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}