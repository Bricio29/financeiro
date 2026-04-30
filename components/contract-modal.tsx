"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Download,
  Link as LinkIcon,
  MessageCircle,
  FileSignature,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/src/utils/supabase/client"; // Ajustado para o seu path atual
import { gerarContratoDocx } from "@/src/utils/gerar-contrato"; // Importando a função de geração

export function ContractModal({
  cliente,
  isOpen,
  onClose,
  onRefresh,
  onEdit,
}: any) {
  if (!cliente) return null;
  const supabase = createClient();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Função para enviar via WhatsApp
  const handleSendWhatsApp = () => {
    if (!cliente.telefone)
      return toast.error("Cliente sem telefone cadastrado.");

    const num = cliente.telefone.replace(/\D/g, "");
    // Note: Em uma fase futura, o [LINK_AQUI] pode ser substituído por uma URL do Supabase Storage
    const msg = encodeURIComponent(
      `Olá ${cliente.responsavel || cliente.nome}, segue o link para análise e assinatura do nosso contrato de prestação de serviços ChatClean: [LINK_AQUI]`,
    );
    window.open(`https://wa.me/55${num}?text=${msg}`, "_blank");
  };

  // Função para atualizar o status no banco e marcar que o contrato foi gerado
  const handleAtualizarStatus = async () => {
    const novoStatus =
      cliente.status_contrato === "assinado" ? "aguardando" : "assinado";

    const { error } = await supabase
      .from("clientes")
      .update({
        status_contrato: novoStatus,
        contrato_gerado: true,
      })
      .eq("id", cliente.id);

    if (error) {
      toast.error("Erro ao atualizar status do contrato.");
    } else {
      toast.success(
        `Status atualizado para ${novoStatus === "assinado" ? "Assinado" : "Aguardando"}!`,
      );
      if (onRefresh) onRefresh();
    }
  };

  // Função disparada ao clicar em Baixar
  const handleDownload = async () => {
    const loadingToast = toast.loading("Gerando documento...");
    try {
      await gerarContratoDocx(cliente);
      toast.success("Contrato gerado com sucesso!", { id: loadingToast });

      // Opcional: Marcar no banco que o contrato foi baixado/gerado
      await supabase
        .from("clientes")
        .update({ contrato_gerado: true })
        .eq("id", cliente.id);

      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Erro ao gerar o arquivo .docx", { id: loadingToast });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f1523] border-slate-800 p-6 sm:max-w-[900px] w-[95vw] h-[90vh] flex flex-col">
        <div className="sr-only">
          <DialogTitle>Contrato de {cliente.nome}</DialogTitle>
        </div>

        {/* Header do Modal com Ações */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {cliente.nome}
            </h2>
            <div className="flex gap-2 mt-1">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  cliente.status_contrato === "assinado"
                    ? "bg-[#00d68f]/20 text-[#00d68f]"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {cliente.status_contrato === "assinado"
                  ? "✅ Assinado"
                  : "⏳ Aguardando Assinatura"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Botão Editar - Adicionado conforme solicitado */}
            <Button
              onClick={() => {
                onClose(); // Fecha o modal do contrato
                if (onEdit) onEdit(cliente); // Abre o formulário de edição
              }}
              variant="secondary"
              className="bg-slate-800 hover:bg-slate-700 text-xs h-8 text-orange-400"
            >
              <Pencil className="w-3.5 h-3.5 mr-2" /> Editar Dados
            </Button>

            <Button
              onClick={handleAtualizarStatus}
              variant="secondary"
              className="bg-slate-800 hover:bg-slate-700 text-xs h-8"
            >
              <FileSignature className="w-3.5 h-3.5 mr-2 text-blue-400" />{" "}
              Alterar Status
            </Button>

            <Button
              variant="secondary"
              className="bg-slate-800 hover:bg-slate-700 text-xs h-8"
            >
              <LinkIcon className="w-3.5 h-3.5 mr-2 text-slate-400" /> Link
            </Button>

            <Button
              onClick={handleSendWhatsApp}
              className="bg-[#00d68f]/10 text-[#00d68f] hover:bg-[#00d68f]/20 text-xs h-8"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-2" /> Enviar
            </Button>

            <Button
              onClick={handleDownload}
              className="bg-[#00d68f] hover:bg-[#00b87a] text-slate-950 font-bold text-xs h-8"
            >
              <Download className="w-3.5 h-3.5 mr-2" /> Baixar .DOCX
            </Button>
          </div>
        </div>

        {/* Visualização do Documento (Estilo Folha de Papel) */}
        <div className="bg-white text-slate-900 flex-1 overflow-y-auto p-8 md:p-12 rounded-sm shadow-xl font-serif text-sm leading-relaxed custom-scrollbar selection:bg-emerald-100">
          <h1 className="text-center font-bold text-lg mb-6 uppercase">
            CONTRATO DE LICENCIAMENTO E PRESTAÇÃO DE SERVIÇO DE USO DE
            PLATAFORMA DE SOFTWARE, AUTO ATENDIMENTO, CHATBOT.
          </h1>

          <h3 className="font-bold mb-2">
            IDENTIFICAÇÃO DAS PARTES CONTRATANTES
          </h3>
          <p className="mb-4 text-justify">
            <strong>CONTRATADA:</strong> VALE NEGÓCIOS LTDA, pessoa jurídica de
            direito privado, inscrita no CNPJ nº 57.487.327/0001-57, com sede na
            Av. Prudente de Morais, 5121 - Lagoa Nova, Natal/RN, Sala M16,
            doravante denominada CONTRATADA, representada por seu representante
            legal Albert Felipe Oliveira Vale, brasileiro, casado, RG nº
            003.185.907, CPF nº 110.774.134-32, residente em Av. dos Caiapós,
            121/123 - Pitimbu, Natal/RN.
          </p>
          <p className="mb-6 text-justify">
            <strong>CONTRATANTE:</strong> {cliente.nome}, pessoa jurídica de
            direito privado, inscrita no CNPJ n°{" "}
            {cliente.cnpj || "________________"}, com sede em{" "}
            {cliente.endereco || "________________"}, doravante denominado
            CONTRATANTE e neste ato representada na forma de seus atos
            constitivos, por seu representante legal{" "}
            {cliente.responsavel || "________________"}, inscrito no CPF sob o
            nº {cliente.cpf || "________________"}.
          </p>

          <h3 className="font-bold mb-2 uppercase">Do Objeto do Contrato</h3>
          <p className="mb-4 text-justify">
            <strong>Cláusula 1ª.</strong> O presente contrato tem por objeto o
            licenciamento de uso, implantação e prestação de serviços da
            plataforma ChatClean, em modelo SaaS (Software as a Service),
            incluindo chatbot, autoatendimento, CRM, ferramentas de atendimento
            multicanal e suporte técnico.
          </p>
          <p className="mb-6 text-justify">
            <strong>Cláusula 2ª.</strong> Em nenhuma hipótese ou circunstância
            este contrato versa sobre a cessão de código-fonte, transferência de
            propriedade intelectual, comercialização, sublicenciamento, ou
            qualquer direito de exploração econômica da plataforma CHATCLEAN
            além do uso aqui licenciado.
          </p>

          <h3 className="font-bold mb-2 uppercase">
            Do Licenciamento, Funcionamento e Acessos
          </h3>
          <p className="mb-2 text-justify">
            <strong>Cláusula 5ª.</strong> O plano contratado inclui:
          </p>
          <ul className="list-disc ml-8 mb-4">
            <li>{cliente.qtd_canais || 1} canais;</li>
            <li>{cliente.qtd_usuarios || 1} usuários;</li>
            <li>Valor mensal: {formatarMoeda(cliente.valor_mensalidade)}.</li>
          </ul>

          <p className="mb-6 text-justify">
            <strong>Cláusula 7-A.</strong>{" "}
            <strong>Do Valor da Implementação:</strong> A CONTRATANTE pagará à
            CONTRATADA o valor único de{" "}
            {formatarMoeda(cliente.valor_implementacao)} referente à
            implementação inicial da plataforma ChatClean.
          </p>

          <div className="mt-20 text-center">
            <p>Natal/RN, {dataAtual}.</p>

            <div className="flex justify-between mt-16 px-10">
              <div className="text-center w-[40%]">
                <div className="border-t border-slate-900 w-full mb-2"></div>
                <p className="font-bold uppercase text-[10px]">
                  {cliente.nome}
                </p>
                <p className="text-[9px]">CONTRATANTE</p>
              </div>
              <div className="text-center w-[40%]">
                <div className="border-t border-slate-900 w-full mb-2"></div>
                <p className="font-bold uppercase text-[10px]">
                  VALE NEGÓCIOS LTDA
                </p>
                <p className="text-[9px]">CONTRATADA</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
