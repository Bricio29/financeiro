"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2, Phone } from "lucide-react";
import { ClientDetails } from "./client-details";
import { createClient } from "@/src/utils/supabase/client";
import { toast } from "sonner";

// Mapeamentos para cores e nomes
const VENDEDORES = [
  { id: "v1", nome: "Albert" },
  { id: "v2", nome: "Milton" },
  { id: "v3", nome: "Augusto" },
  { id: "v4", nome: "Eric" },
  { id: "v5", nome: "Lampião" },
  { id: "v6", nome: "Ederson" },
];

const CANAIS = [
  { id: "c1", nome: "🤝 Indicação", cor: "#00d68f" },
  { id: "c2", nome: "📢 Tráfego Pago", cor: "#3b9eff" },
  { id: "c3", nome: "🎪 Evento", cor: "#b06aff" },
  { id: "c4", nome: "🌱 Orgânico", cor: "#ffb020" },
  { id: "c5", nome: "🤲 Parceiro", cor: "#00cfff" },
  { id: "c6", nome: "📌 Outro", cor: "#5a7090" },
];

export function ClientTable({
  data,
  onRefresh,
}: {
  data: any[];
  onRefresh: () => void;
}) {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const supabase = createClient();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  const getVendedor = (id: string) =>
    VENDEDORES.find((v) => v.id === id)?.nome || "—";
  const getCanal = (id: string) =>
    CANAIS.find((c) => c.id === id) || { nome: "📌 Outro", cor: "#5a7090" };

  // Lógica original de Vencimento
  const renderVencimento = (dia: number) => {
    if (!dia) return <span className="text-slate-500">—</span>;
    const hoje = new Date();
    const venc = new Date(hoje.getFullYear(), hoje.getMonth(), dia);
    const diff = Math.ceil((venc.getTime() - hoje.getTime()) / 86400000);

    if (diff < 0)
      return (
        <span className="bg-red-500/15 text-red-500 font-bold px-2 py-1 rounded-md text-[10px] font-mono">
          ⚠️ +{Math.abs(diff)}d
        </span>
      );
    if (diff === 0)
      return (
        <span className="bg-red-500/15 text-red-500 px-2 py-1 rounded-md text-[10px] font-mono">
          🔴 Hoje
        </span>
      );
    if (diff <= 5)
      return (
        <span className="bg-amber-500/15 text-amber-400 px-2 py-1 rounded-md text-[10px] font-mono">
          ⏰ {diff}d
        </span>
      );
    return (
      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md text-[10px] font-mono">
        ✅ dia {dia}
      </span>
    );
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Excluir este cliente?")) return;
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir cliente.");
    else {
      toast.success("Cliente removido");
      onRefresh();
    }
  };

  const openWhatsApp = (
    e: React.MouseEvent,
    tel: string,
    nome: string,
    valor: number,
  ) => {
    e.stopPropagation();
    const num = tel.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Olá! 👋 Passando para informar que a fatura da *ChatClean* referente ao serviço de *${nome}* no valor de *${formatarMoeda(valor)}* está próxima do vencimento. Por favor, entre em contato para efetuar o pagamento. Obrigado! 🙏`,
    );
    window.open(`https://wa.me/55${num}?text=${msg}`, "_blank");
  };

  return (
    <>
      <Table>
        <TableHeader className="bg-slate-900 border-b border-slate-800">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              Empresa
            </TableHead>
            <TableHead className="text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              Responsável
            </TableHead>
            <TableHead className="text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              WhatsApp
            </TableHead>
            <TableHead className="text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              Vendedor
            </TableHead>
            <TableHead className="text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              Mensal
            </TableHead>
            <TableHead className="text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              Vencimento
            </TableHead>
            <TableHead className="text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              Status
            </TableHead>
            <TableHead className="text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              Contrato
            </TableHead>
            <TableHead className="text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              Canal
            </TableHead>
            <TableHead className="text-slate-400 uppercase text-[10px] tracking-wider font-mono text-right">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((cliente) => {
              const canal = getCanal(cliente.canal_id);
              return (
                <TableRow
                  key={cliente.id}
                  className="border-slate-800 hover:bg-slate-800/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedClient(cliente)}
                >
                  <TableCell className="py-3">
                    <div className="font-semibold text-slate-200">
                      {cliente.nome}
                    </div>
                    {cliente.observacoes && (
                      <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                        {cliente.observacoes}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {cliente.responsavel || "—"}
                  </TableCell>
                  <TableCell>
                    {cliente.telefone ? (
                      <button
                        onClick={(e) =>
                          openWhatsApp(
                            e,
                            cliente.telefone,
                            cliente.nome,
                            cliente.valor_mensalidade,
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors"
                      >
                        <Phone className="w-3 h-3" /> {cliente.telefone}
                      </button>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {getVendedor(cliente.vendedor_id)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {cliente.valor_mensalidade > 0 ? (
                      formatarMoeda(cliente.valor_mensalidade)
                    ) : (
                      <span className="text-slate-500">PERMUTA</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {renderVencimento(cliente.dia_vencimento)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[9.5px] uppercase tracking-wider ${cliente.status === "ativo" ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25" : cliente.status === "cancelado" ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400"}`}
                    >
                      {cliente.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[9.5px] uppercase tracking-wider ${cliente.status_contrato === "assinado" ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25" : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"}`}
                    >
                      {cliente.status_contrato === "assinado"
                        ? "✅ Assinado"
                        : "⏳ Aguardando"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: `${canal.cor}18`,
                        color: canal.cor,
                      }}
                    >
                      {canal.nome}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors rounded-md hover:bg-slate-800">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, cliente.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-md hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-12 text-slate-500"
              >
                <div className="text-3xl mb-2 opacity-50">🔍</div>
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ClientDetails
        cliente={selectedClient}
        isOpen={!!selectedClient}
        onClose={() => setSelectedClient(null)}
      />
    </>
  );
}
