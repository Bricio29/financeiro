"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { ClientTable } from "@/components/client-table";
import { ClientForm } from "@/components/client-form";
import { Search, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const fetchClientes = async () => {
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .order("nome", { ascending: true });
    if (data) setClientes(data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Lógica dos KPIs
  const ativos = clientes.filter((c) => c.status === "ativo");
  const mrr = ativos.reduce((acc, c) => acc + (c.valor_mensalidade || 0), 0);
  const aguardandoContrato = clientes.filter(
    (c) => c.status_contrato === "aguardando",
  ).length;

  const getVencendo5 = () => {
    const hoje = new Date();
    return clientes.filter((c) => {
      if (c.status !== "ativo" || !c.dia_vencimento) return false;
      const venc = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        c.dia_vencimento,
      );
      const diff = Math.ceil((venc.getTime() - hoje.getTime()) / 86400000);
      return diff >= 0 && diff <= 5;
    });
  };
  const vencendo5 = getVencendo5();

  // Aplicação dos Filtros
  const filteredData = clientes.filter((c) => {
    // Filtro das Tabs
    let passTab = true;
    if (filter === "vence5") {
      passTab = vencendo5.some((v) => v.id === c.id);
    } else if (filter === "aguardando") {
      passTab = c.status_contrato === "aguardando";
    } else if (filter !== "todos") {
      passTab = c.status === filter;
    }

    // Filtro de Busca (Search)
    const passSearch =
      search === "" ||
      c.nome?.toLowerCase().includes(search.toLowerCase()) ||
      c.responsavel?.toLowerCase().includes(search.toLowerCase());

    return passTab && passSearch;
  });

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Cabeçalho */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white font-display">
            👥 Clientes
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Gestão de cobranças e vencimentos
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md font-medium transition-colors border border-slate-700 text-sm">
            📊 Exportar
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
          >
            + Novo Cliente
          </button>
        </div>
      </div>

      {/* Alerta de Vencimentos */}
      {vencendo5.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-red-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-4">
          <Bell className="text-amber-500 w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-500 text-sm mb-2">
              ⚠️ {vencendo5.length} cliente(s) com fatura vencendo em até 5
              dias!
            </h4>
            <div className="flex flex-col gap-1.5">
              {vencendo5.map((c) => (
                <div
                  key={c.id}
                  className="text-xs text-slate-300 flex items-center gap-2"
                >
                  • <span className="font-bold text-white">{c.nome}</span> — dia{" "}
                  {c.dia_vencimento} — {formatarMoeda(c.valor_mensalidade)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500"></div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
            Clientes Ativos
          </div>
          <div className="text-2xl font-bold text-white font-display leading-none mb-1">
            {ativos.length}
          </div>
          <div className="text-[11px] text-slate-500">
            de {clientes.length} cadastrados
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500"></div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
            MRR Recorrente
          </div>
          <div className="text-2xl font-bold text-white font-display leading-none mb-1">
            {formatarMoeda(mrr)}
          </div>
          <div className="text-[11px] text-slate-500">mensalidades ativas</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 right-0 h-0.5 ${vencendo5.length > 0 ? "bg-amber-500" : "bg-emerald-500"}`}
          ></div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
            Vencendo em 5 dias
          </div>
          <div className="text-2xl font-bold text-white font-display leading-none mb-1">
            {vencendo5.length}
          </div>
          <div
            className={`text-[11px] ${vencendo5.length > 0 ? "text-amber-500" : "text-emerald-500"}`}
          >
            {vencendo5.length > 0 ? "⚠️ Cobrar agora" : "✅ Tudo ok"}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 right-0 h-0.5 ${aguardandoContrato > 0 ? "bg-amber-500" : "bg-emerald-500"}`}
          ></div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
            Contratos Pendentes
          </div>
          <div className="text-2xl font-bold text-white font-display leading-none mb-1">
            {aguardandoContrato}
          </div>
          <div className="text-[11px] text-slate-500">
            aguardando assinatura
          </div>
        </div>
      </div>

      {/* Tabs de Filtro */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {[
          { id: "todos", label: "Todos" },
          { id: "ativo", label: "Ativos" },
          { id: "congelado", label: "Congelados" },
          { id: "cancelado", label: "Cancelados" },
          { id: "vence5", label: "⚠️ Vence 5d" },
          { id: "aguardando", label: "📄 Contrato Pendente" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors border ${
              filter === tab.id
                ? "bg-emerald-500 text-slate-950 border-emerald-500 font-bold"
                : "bg-transparent text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabela de Clientes */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap bg-slate-950">
          <h3 className="font-display font-semibold text-white">
            Base de Clientes
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-md py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors w-[220px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <ClientTable data={filteredData} onRefresh={fetchClientes} />
        </div>
      </div>

      {/* Modal de Criação */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 sm:max-w-[700px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold">
              Novo Cliente
            </DialogTitle>
          </DialogHeader>
          <ClientForm
            onSuccess={() => {
              setIsModalOpen(false);
              fetchClientes();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
