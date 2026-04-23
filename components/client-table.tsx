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
import { ClientDetails } from "./client-details";

export function ClientTable({ initialData }: { initialData: any[] }) {
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  return (
    <>
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900 border-b border-slate-800">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-400">Nome / Empresa</TableHead>
              <TableHead className="text-slate-400">Responsável</TableHead>
              <TableHead className="text-slate-400">Mensalidade</TableHead>
              <TableHead className="text-slate-400">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((cliente) => (
              <TableRow
                key={cliente.id}
                className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                onClick={() => setSelectedClient(cliente)}
              >
                <TableCell className="font-medium text-slate-200">
                  {cliente.nome}
                </TableCell>
                <TableCell className="text-slate-400">
                  {cliente.responsavel || "—"}
                </TableCell>
                <TableCell className="text-slate-200">
                  {formatarMoeda(cliente.valor_mensalidade)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      cliente.status === "ativo"
                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        : "bg-slate-700 text-slate-300"
                    }
                  >
                    {cliente.status?.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ClientDetails
        cliente={selectedClient}
        isOpen={!!selectedClient}
        onClose={() => setSelectedClient(null)}
      />
    </>
  );
}
