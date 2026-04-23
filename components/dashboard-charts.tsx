"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Dados simulados baseados no seu data.js original para testar o visual
const growthData = [
  { mes: "Nov", receita: 15000, custos: 8000 },
  { mes: "Dez", receita: 18000, custos: 9500 },
  { mes: "Jan", receita: 28000, custos: 14750 },
  { mes: "Fev", receita: 29500, custos: 17791 },
  { mes: "Mar", receita: 31000, custos: 18349 },
  { mes: "Abr", receita: 37358, custos: 21915 },
];

export function DashboardCharts() {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Gráfico de Crescimento (Linhas) */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-white">
            Crescimento Receita vs Custos
          </h3>
          <p className="text-sm text-slate-400">Últimos 6 meses</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growthData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2d45"
                vertical={false}
              />
              <XAxis
                dataKey="mes"
                stroke="#5a7090"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#5a7090"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  borderColor: "#1f2d45",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#e8edf5" }}
                formatter={(value: any) => formatarMoeda(Number(value))}
              />
              <Line
                type="monotone"
                dataKey="receita"
                name="Receita"
                stroke="#00d68f"
                strokeWidth={3}
                dot={{ r: 4, fill: "#00d68f" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="custos"
                name="Custos"
                stroke="#ff4d6d"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ff4d6d" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Barras (Resumo Mensal) */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-white">
            Balanço Mensal
          </h3>
          <p className="text-sm text-slate-400">Comparativo direto</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={growthData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2d45"
                vertical={false}
              />
              <XAxis
                dataKey="mes"
                stroke="#5a7090"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#5a7090"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${value / 1000}k`}
              />
              <Tooltip
                cursor={{ fill: "#1f2d45", opacity: 0.4 }}
                contentStyle={{
                  backgroundColor: "#111827",
                  borderColor: "#1f2d45",
                  borderRadius: "8px",
                }}
                formatter={(value: any) => formatarMoeda(Number(value))}
              />
              <Bar
                dataKey="receita"
                name="Receita"
                fill="#00d68f"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="custos"
                name="Custos"
                fill="#ff4d6d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
