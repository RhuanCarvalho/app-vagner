"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Package, Edit, Save, X, ChevronUp, Trash2, Search } from "lucide-react"
import { ServiceProps, useServices } from "@/services/adminServices/services/servicesServices"
import { SelectWithSearch } from "@/components/ui/SelectWithSearch" // Importe o novo componente

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
            getCategorias
        }
    } = useServices();

    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [novoProduto, setNovoProduto] = useState<AddServiceProps>({ service: "", price: "", categoria: "" })
    const [editandoProduto, setEditandoProduto] = useState<string | null>(null)
    const [produtoEditado, setProdutoEditado] = useState<AddServiceProps>({ service: "", price: "", categoria: "" })
    const [filtro, setFiltro] = useState("")

    // Converter categorias para o formato do SelectWithSearch
    const categoriaOptions = selectCategorias.map(categoria => ({
        value: categoria.nome,
        label: categoria.nome
    }))

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

    const adicionarProduto = () => {
        // if (novoProduto.nome && novoProduto.valor && novoProduto.categoria) {
        //     const produto: Produto = {
        //         id: produtos.length + 1,
        //         nome: novoProduto.nome,
        //         valor: Number.parseFloat(novoProduto.valor),
        //         categoria: novoProduto.categoria,
        //     }
        //     setProdutos([...produtos, produto])
        //     setNovoProduto({ nome: "", valor: "", categoria: "" })
        //     setMostrarFormulario(false)
        // }
    }

    const iniciarEdicao = (produto: ServiceProps) => {
        setEditandoProduto(produto.id_company_service)
        setProdutoEditado({
            service: produto.service,
            price: produto.price,
            categoria: produto.categoria
        })
    }

    const salvarEdicao = () => {
        // if (editandoProduto && produtoEditado.nome && produtoEditado.valor && produtoEditado.categoria) {
        //     setProdutos(
        //         produtos.map((p) =>
        //             p.id === editandoProduto
        //                 ? {
        //                     ...p,
        //                     nome: produtoEditado.nome,
        //                     valor: Number.parseFloat(produtoEditado.valor),
        //                     categoria: produtoEditado.categoria,
        //                 }
        //                 : p,
        //         ),
        //     )
        //     setEditandoProduto(null)
        //     setProdutoEditado({ nome: "", valor: "", categoria: "" })
        // }
    }

    const cancelarEdicao = () => {
        setEditandoProduto(null)
        setProdutoEditado({ service: "", price: "", categoria: "" })
    }

    const excluirProduto = (id: string) => {
        // setProdutos(produtos.filter((p) => p.id !== id))
    }

    const limparFiltro = () => {
        setFiltro("")
    }

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
        <div className="container mx-auto p-4 w-full overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-gray-600" />
                    <h1 className="text-lg font-bold text-gray-600">Listagem de Serviços</h1>
                </div>

                <Button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className="flex items-center gap-2 bg-[#002547] text-white w-full sm:w-auto"
                >
                    {mostrarFormulario ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4 text-white" />}
                    {mostrarFormulario ? "Cancelar" : "Adicionar Serviço"}
                </Button>
            </div>

            {/* Adicionar serviço */}
            {mostrarFormulario && (
                <div className="bg-gray-100 rounded-lg p-4 sm:p-6 mb-6 border">
                    <h3 className="text-lg font-semibold mb-4">Novo Serviço</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome do Serviço</Label>
                            <Input
                                id="nome"
                                placeholder="Digite o nome do serviço"
                                value={novoProduto.service}
                                onChange={(e) => setNovoProduto({ ...novoProduto, service: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="categoria">Categoria</Label>
                            <SelectWithSearch
                                options={categoriaOptions}
                                value={novoProduto.categoria}
                                onValueChange={(value) => setNovoProduto({ ...novoProduto, categoria: value })}
                                placeholder="Selecione uma categoria"
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
                ): <p className="text-sm text-muted-foreground mt-2">Digite para filtrar...</p>
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
                                                <Input
                                                    value={produtoEditado.service}
                                                    onChange={(e) => setProdutoEditado({ ...produtoEditado, service: e.target.value })}
                                                    className="max-w-xs"
                                                />
                                            ) : (
                                                <span
                                                    className="cursor-pointer hover:text-primary transition-colors"
                                                    onClick={() => iniciarEdicao(produto)}
                                                >
                                                    {produto.service}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editandoProduto === produto.id_company_service ? (
                                                <SelectWithSearch
                                                    options={categoriaOptions}
                                                    value={produtoEditado.categoria}
                                                    onValueChange={(value) => setProdutoEditado({ ...produtoEditado, categoria: value })}
                                                    placeholder="Selecione uma categoria"
                                                    className="max-w-xs"
                                                />
                                            ) : (
                                                <span
                                                    className="cursor-pointer hover:text-primary transition-colors"
                                                    onClick={() => iniciarEdicao(produto)}
                                                >
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
                                                <SelectWithSearch
                                                    options={categoriaOptions}
                                                    value={produtoEditado.categoria}
                                                    onValueChange={(value) => setProdutoEditado({ ...produtoEditado, categoria: value })}
                                                    placeholder="Selecione uma categoria"
                                                />
                                            ) : (
                                                <span
                                                    className="cursor-pointer hover:text-primary transition-colors block"
                                                    onClick={() => iniciarEdicao(produto)}
                                                >
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
                                                <Input
                                                    value={produtoEditado.service}
                                                    onChange={(e) => setProdutoEditado({ ...produtoEditado, service: e.target.value })}
                                                    className="w-full text-center"
                                                />
                                            ) : (
                                                <span
                                                    className="cursor-pointer hover:text-primary transition-colors block"
                                                    onClick={() => iniciarEdicao(produto)}
                                                >
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
    )
}