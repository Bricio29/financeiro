import { DashboardCharts } from "@/components/dashboard-charts";
import { DollarSign, TrendingUp, Activity, Users } from "lucide-react";

export default function Home() {
  // Num cenário real, faríamos a busca agregada no Supabase aqui
  // Ex: const { data } = await supabase.rpc('get_dashboard_stats')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white font-display">
            Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Visão financeira geral do sistema
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md font-medium transition-colors border border-slate-700 text-sm">
            📊 Exportar
          </button>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
            + Lançamento
          </button>
        </div>
      </div>

      {/* KPIs (Indicadores Principais) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Receita Total
            </span>
            <DollarSign className="text-emerald-500 w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">R$ 37.358,00</div>
          <div className="text-xs text-slate-500">
            Rec: R$ 28k + Var: R$ 9.3k
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Total Custos
            </span>
            <Activity className="text-blue-500 w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">R$ 21.915,00</div>
          <div className="text-xs text-slate-500">
            Fixos + Variáveis + Despesas
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Resultado Líquido
            </span>
            <TrendingUp className="text-emerald-500 w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">R$ 15.443,00</div>
          <div className="text-xs text-emerald-400 font-medium">▲ Positivo</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              MRR (Recorrência)
            </span>
            <Users className="text-cyan-500 w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">R$ 28.500,00</div>
          <div className="text-xs text-slate-500">32 clientes ativos</div>
        </div>
      </div>

      {/* Componente dos Gráficos */}
      <DashboardCharts />
    </div>
  );
}
