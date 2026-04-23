"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ClientTable } from "@/components/client-table";
import { ClientForm } from "@/components/client-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  // Função para buscar dados
  const fetchClientes = async () => {
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .order("nome", { ascending: true });

    if (data) setClientes(data);
  };

  // Carrega os clientes ao montar a página
  useEffect(() => {
    fetchClientes();
  }, []);

  // Ação executada com sucesso após salvar no formulário
  const handleSuccess = () => {
    setIsModalOpen(false); // Fecha o modal
    fetchClientes(); // Recarrega a tabela com o novo cliente
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white font-display">
          Clientes (CRM)
        </h2>

        {/* Botão que abre o modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
              + Novo Cliente
            </button>
          </DialogTrigger>
          <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Novo Cliente</DialogTitle>
            </DialogHeader>

            {/* O nosso novo formulário é renderizado aqui dentro */}
            <ClientForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <ClientTable initialData={clientes} />
    </div>
  );
}
