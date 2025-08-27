"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Package, Edit, Save, X, ChevronUp, Trash2 } from "lucide-react"

interface Produto {
    id: number
    nome: string
    valor: number
    categoria: string
}

export default function ProdutosPage() {
    const [produtos, setProdutos] = useState<Produto[]>([
        { id: 1, nome: "Troca de óleo", valor: 150.0, categoria: "Manutenção Motor" },
        { id: 2, nome: "Alinhamento", valor: 389.9, categoria: "Manutenção Pneus" },
        { id: 3, nome: "Revisão Geral", valor: 299.99, categoria: "Manutenção Geral" },
    ])

    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [novoProduto, setNovoProduto] = useState({ nome: "", valor: "", categoria: "" })
    const [editandoProduto, setEditandoProduto] = useState<number | null>(null)
    const [produtoEditado, setProdutoEditado] = useState({ nome: "", valor: "", categoria: "" })

    const adicionarProduto = () => {
        if (novoProduto.nome && novoProduto.valor && novoProduto.categoria) {
            const produto: Produto = {
                id: produtos.length + 1,
                nome: novoProduto.nome,
                valor: Number.parseFloat(novoProduto.valor),
                categoria: novoProduto.categoria,
            }
            setProdutos([...produtos, produto])
            setNovoProduto({ nome: "", valor: "", categoria: "" })
            setMostrarFormulario(false)
        }
    }

    const iniciarEdicao = (produto: Produto) => {
        setEditandoProduto(produto.id)
        setProdutoEditado({ nome: produto.nome, valor: produto.valor.toString(), categoria: produto.categoria })
    }

    const salvarEdicao = () => {
        if (editandoProduto && produtoEditado.nome && produtoEditado.valor && produtoEditado.categoria) {
            setProdutos(
                produtos.map((p) =>
                    p.id === editandoProduto
                        ? {
                            ...p,
                            nome: produtoEditado.nome,
                            valor: Number.parseFloat(produtoEditado.valor),
                            categoria: produtoEditado.categoria,
                        }
                        : p,
                ),
            )
            setEditandoProduto(null)
            setProdutoEditado({ nome: "", valor: "", categoria: "" })
        }
    }

    const cancelarEdicao = () => {
        setEditandoProduto(null)
        setProdutoEditado({ nome: "", valor: "", categoria: "" })
    }

    const excluirProduto = (id: number) => {
        setProdutos(produtos.filter((p) => p.id !== id))
    }

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor)
    }

    return (
        <div className="container mx-auto p-6 w-full overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-gray-600" />
                    <h1 className="text-lg font-bold text-gray-600">Listagem de Serviços</h1>
                </div>

                <Button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="flex items-center gap-2 bg-[#002547] text-white">
                    {mostrarFormulario ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4 text-white" />}
                    {mostrarFormulario ? "Cancelar" : "Adicionar Serviço"}
                </Button>
            </div>

            {mostrarFormulario && (
                <div className="bg-gray-100 rounded-lg p-6 mb-6 border">
                    <h3 className="text-lg font-semibold mb-4">Novo Serviço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome do Serviço</Label>
                            <Input
                                id="nome"
                                placeholder="Digite o nome do serviço"
                                value={novoProduto.nome}
                                onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="categoria">Categoria</Label>
                            <Input
                                id="categoria"
                                placeholder="Digite a categoria"
                                value={novoProduto.categoria}
                                onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="valor">Valor (R$)</Label>
                            <Input
                                id="valor"
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                value={novoProduto.valor}
                                onChange={(e) => setNovoProduto({ ...novoProduto, valor: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button
                            onClick={adicionarProduto}
                            disabled={!novoProduto.nome || !novoProduto.valor || !novoProduto.categoria}
                            className="bg-[#002547] text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setMostrarFormulario(false)
                                setNovoProduto({ nome: "", valor: "", categoria: "" })
                            }}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

            {produtos.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum serviço cadastrado</h3>
                    <p className="text-muted-foreground mb-4">Comece adicionando seu primeiro serviço</p>
                </div>
            ) : (
                <div className="rounded-md border">
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
                            {produtos.map((produto) => (
                                <TableRow key={produto.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{produto.id}</TableCell>
                                    <TableCell>
                                        {editandoProduto === produto.id ? (
                                            <Input
                                                value={produtoEditado.nome}
                                                onChange={(e) => setProdutoEditado({ ...produtoEditado, nome: e.target.value })}
                                                className="max-w-xs"
                                            />
                                        ) : (
                                            <span
                                                className="cursor-pointer hover:text-primary transition-colors"
                                                onClick={() => iniciarEdicao(produto)}
                                            >
                                                {produto.nome}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editandoProduto === produto.id ? (
                                            <Input
                                                value={produtoEditado.categoria}
                                                onChange={(e) => setProdutoEditado({ ...produtoEditado, categoria: e.target.value })}
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
                                        {editandoProduto === produto.id ? (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={produtoEditado.valor}
                                                onChange={(e) => setProdutoEditado({ ...produtoEditado, valor: e.target.value })}
                                                className="max-w-[120px] ml-auto"
                                            />
                                        ) : (
                                            <span
                                                className="cursor-pointer hover:text-primary transition-colors font-semibold"
                                                onClick={() => iniciarEdicao(produto)}
                                            >
                                                {formatarValor(produto.valor)}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editandoProduto === produto.id ? (
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
                                                    onClick={() => excluirProduto(produto.id)}
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
            )}

            {produtos.length > 0 && (
                <div className="mt-6 text-center text-muted-foreground">
                    <p>
                        {produtos.length} serviço{produtos.length !== 1 ? "s" : ""} cadastrado{produtos.length !== 1 ? "s" : ""}
                    </p>
                </div>
            )}
        </div>
    )
}
