"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, FileText, Receipt, Pencil } from "lucide-react";

export function ClientDetails({ cliente, isOpen, onClose }: any) {
  if (!cliente) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-slate-950 border-slate-800 text-slate-200 w-[400px] sm:w-[540px]">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-bold text-white">
            {cliente.nome}
          </SheetTitle>
          <p className="text-sm text-slate-500">
            {cliente.cnpj || "CNPJ não informado"}
          </p>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-none">
              {cliente.status?.toUpperCase()}
            </Badge>
            <Badge
              variant="outline"
              className="border-amber-500/50 text-amber-400"
            >
              {cliente.status_contrato === "assinado"
                ? "✅ Assinado"
                : "⏳ Aguardando Assinatura"}
            </Badge>
          </div>

          <Separator className="bg-slate-800" />

          {/* Contact Info */}
          <section>
            <h4 className="text-sm font-semibold text-slate-400 uppercase mb-3">
              Contacto
            </h4>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Responsável</span>
                <span className="text-sm">{cliente.responsavel || "—"}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 hover:bg-slate-800"
                >
                  <Phone className="w-4 h-4 mr-2 text-emerald-500" /> WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 hover:bg-slate-800"
                >
                  <Mail className="w-4 h-4 mr-2 text-blue-500" /> Email
                </Button>
              </div>
            </div>
          </section>

          {/* Financial Info */}
          <section>
            <h4 className="text-sm font-semibold text-slate-400 uppercase mb-3">
              Dados Financeiros
            </h4>
            <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <div>
                <span className="text-xs text-slate-500">Mensalidade</span>
                <p className="text-lg font-bold text-emerald-400">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(cliente.valor_mensalidade)}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Vencimento</span>
                <p className="text-sm font-medium">
                  Todo dia {cliente.dia_vencimento || "—"}
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section>
            <h4 className="text-sm font-semibold text-slate-400 uppercase mb-3">
              Acções Rápidas
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                className="bg-slate-800 hover:bg-slate-700 text-xs"
              >
                <FileText className="w-3 h-3 mr-2" /> Ver Contrato
              </Button>
              <Button
                variant="secondary"
                className="bg-slate-800 hover:bg-slate-700 text-xs"
              >
                <Receipt className="w-3 h-3 mr-2" /> Gerar NF
              </Button>
              <Button
                variant="outline"
                className="border-slate-800 hover:bg-slate-800 text-xs col-span-2"
              >
                <Pencil className="w-3 h-3 mr-2" /> Editar Cliente
              </Button>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
