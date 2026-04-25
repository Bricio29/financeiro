"use client";
import { useState } from "react";
import { ContractModal } from "./contract-modal";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Receipt, Pencil, MessageCircle } from "lucide-react";

// Mapeamentos para os nomes
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

export function ClientDetails({ cliente, isOpen, onClose, onEdit }: any) {
  const [isContractOpen, setIsContractOpen] = useState(false);

  if (!cliente) return null;

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
  const canal = getCanal(cliente.canal_id);

  const formatarData = (dataStr: string) => {
    if (!dataStr) return "—";
    return dataStr; // Formato YYYY-MM-DD
  };

  // Lógica da badge de dias (⚠️ +10d)
  const renderBadgeVencimento = (dia: number) => {
    if (!dia) return null;
    const hoje = new Date();
    const venc = new Date(hoje.getFullYear(), hoje.getMonth(), dia);
    const diff = Math.ceil((venc.getTime() - hoje.getTime()) / 86400000);

    if (diff < 0)
      return (
        <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold ml-2">
          ⚠️ +{Math.abs(diff)}d
        </span>
      );
    if (diff === 0)
      return (
        <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold ml-2">
          Hoje
        </span>
      );
    if (diff <= 5)
      return (
        <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold ml-2">
          ⚠️ {diff}d
        </span>
      );
    return null;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* O !max-w-[750px] força a largura por cima das definições padrão do Shadcn */}
      <SheetContent className="bg-[#0f1523] border-slate-800 text-slate-200 w-full sm:!max-w-[750px] overflow-y-auto custom-scrollbar p-0">
        {/* Acessibilidade para leitores de ecrã (Oculto visualmente) */}
        <div className="sr-only">
          <SheetTitle>Detalhes do Cliente: {cliente.nome}</SheetTitle>
          <SheetDescription>
            Informações detalhadas de contato, financeiras e ações para o
            cliente selecionado.
          </SheetDescription>
        </div>

        <div className="p-8 flex flex-col gap-8">
          {/* Cabeçalho */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 tracking-wide">
              {cliente.nome}
            </h2>
            <p className="text-[#5a7090] text-sm">
              {cliente.cnpj || "CNPJ não informado"}
            </p>
          </div>

          {/* Badges Superiores */}
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-[#00d68f]/10 text-[#00d68f] hover:bg-[#00d68f]/20 border-none font-bold px-3 py-1 rounded-md uppercase text-[10px] tracking-wider">
              {cliente.status}
            </Badge>
            <Badge className="bg-[#00d68f]/10 text-[#00d68f] hover:bg-[#00d68f]/20 border-none font-bold px-3 py-1 rounded-md uppercase text-[10px] tracking-wider">
              {cliente.status_contrato === "assinado"
                ? "✅ CONTRATO ASSINADO"
                : "⏳ AGUARDANDO ASSINATURA"}
            </Badge>
            <Badge
              style={{ backgroundColor: `${canal.cor}15`, color: canal.cor }}
              className="hover:bg-opacity-20 border-none font-bold px-3 py-1 rounded-md text-[10px] tracking-wider"
            >
              {canal.nome}
            </Badge>
          </div>

          {/* Secção: Informações de Contato */}
          <section>
            <h4 className="text-[11px] font-semibold text-[#5a7090] uppercase tracking-widest mb-4">
              Informações de Contato
            </h4>
            <Separator className="bg-slate-800/60 mb-5" />

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex flex-col gap-2 overflow-hidden">
                <span className="text-[10px] text-[#5a7090] uppercase tracking-wider font-semibold">
                  Responsável
                </span>
                <span
                  className="text-sm font-medium text-slate-200 uppercase truncate"
                  title={cliente.responsavel}
                >
                  {cliente.responsavel || "—"}
                </span>
              </div>

              <div className="flex flex-col gap-2 overflow-hidden">
                <span className="text-[10px] text-[#5a7090] uppercase tracking-wider font-semibold">
                  Telefone / WhatsApp
                </span>
                {cliente.telefone ? (
                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/55${cliente.telefone.replace(/\D/g, "")}`,
                        "_blank",
                      )
                    }
                    className="flex items-center w-fit gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-[#00d68f]/10 text-[#00d68f] border border-[#00d68f]/20 hover:bg-[#00d68f]/20 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> {cliente.telefone}
                  </button>
                ) : (
                  <span className="text-sm text-slate-500">—</span>
                )}
              </div>

              <div className="flex flex-col gap-2 overflow-hidden">
                <span className="text-[10px] text-[#5a7090] uppercase tracking-wider font-semibold">
                  E-mail
                </span>
                <span
                  className="text-sm font-medium text-slate-200 truncate"
                  title={cliente.email}
                >
                  {cliente.email || "—"}
                </span>
              </div>

              <div className="flex flex-col gap-2 overflow-hidden">
                <span className="text-[10px] text-[#5a7090] uppercase tracking-wider font-semibold">
                  Vendedor
                </span>
                <span className="text-sm font-medium text-slate-200 truncate">
                  {getVendedor(cliente.vendedor_id)}
                </span>
              </div>
            </div>
          </section>

          {/* Secção: Dados Financeiros */}
          <section>
            <h4 className="text-[11px] font-semibold text-[#5a7090] uppercase tracking-widest mb-4">
              Dados Financeiros
            </h4>
            <Separator className="bg-slate-800/60 mb-5" />

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#5a7090] uppercase tracking-wider font-semibold">
                  Mensalidade
                </span>
                <p className="text-[22px] font-bold text-[#00d68f] tracking-tight">
                  {cliente.valor_mensalidade > 0 ? (
                    formatarMoeda(cliente.valor_mensalidade)
                  ) : (
                    <span className="text-slate-400 text-lg">PERMUTA</span>
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#5a7090] uppercase tracking-wider font-semibold">
                  Vencimento
                </span>
                <p className="text-sm font-medium text-white flex items-center mt-1">
                  Todo dia {cliente.dia_vencimento || "—"}
                  {renderBadgeVencimento(cliente.dia_vencimento)}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#5a7090] uppercase tracking-wider font-semibold">
                  Início
                </span>
                <span className="text-sm font-medium text-slate-200">
                  {formatarData(cliente.data_inicio)}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#5a7090] uppercase tracking-wider font-semibold">
                  Aniversário
                </span>
                <span className="text-sm font-medium text-slate-200">
                  {formatarData(cliente.data_aniversario)}
                </span>
              </div>
            </div>
          </section>

          {/* Secção: Ações */}
          <section>
            <h4 className="text-[11px] font-semibold text-[#5a7090] uppercase tracking-widest mb-4">
              Ações
            </h4>
            <Separator className="bg-slate-800/60 mb-5" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button
                onClick={() => setIsContractOpen(true)}
                variant="outline"
                className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-200 h-10 px-4 text-xs w-full"
              >
                <FileText className="w-3.5 h-3.5 mr-2 shrink-0" />{" "}
                {cliente.contrato_gerado ? "Ver Contrato" : "Gerar Contrato"}
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-200 h-10 px-4 text-xs w-full"
              >
                <Receipt className="w-3.5 h-3.5 mr-2 shrink-0" /> Gerar NF
              </Button>

              {cliente.telefone ? (
                <Button
                  onClick={() =>
                    window.open(
                      `https://wa.me/55${cliente.telefone.replace(/\D/g, "")}`,
                      "_blank",
                    )
                  }
                  variant="outline"
                  className="bg-[#00d68f]/5 border-[#00d68f]/30 hover:bg-[#00d68f]/10 text-[#00d68f] h-10 px-4 text-xs w-full"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-2 shrink-0" />{" "}
                  WhatsApp
                </Button>
              ) : (
                <Button
                  disabled
                  variant="outline"
                  className="bg-transparent border-slate-800 text-slate-600 h-10 px-4 text-xs w-full opacity-50 cursor-not-allowed"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-2 shrink-0" />{" "}
                  WhatsApp
                </Button>
              )}

              <Button
                onClick={() => {
                  onClose(); // Fecha a gaveta
                  if (onEdit) onEdit(cliente); // Abre o formulário de edição
                }}
                variant="outline"
                className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-200 h-10 px-4 text-xs w-full"
              >
                <Pencil className="w-3.5 h-3.5 mr-2 text-orange-400 shrink-0" />{" "}
                Editar
              </Button>

              {/* Adicione o Modal do Contrato no final do ficheiro (antes da última div/sheet) */}
              <ContractModal
                cliente={cliente}
                isOpen={isContractOpen}
                onClose={() => setIsContractOpen(false)}
              />
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
