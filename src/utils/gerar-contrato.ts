"use client";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

export const gerarContratoDocx = async (cliente: any) => {
  try {
    console.log("1. Iniciando download do template...");

    // Tenta buscar o ficheiro na pasta public
    const response = await fetch("/templates/CONTRATO.docx");

    // Verifica se o ficheiro foi realmente encontrado (Erro 404)
    if (!response.ok) {
      throw new Error(
        `Ficheiro não encontrado (Erro ${response.status}). Verifique se colocou o CONTRATO.docx exatamente na pasta "public/templates/"`,
      );
    }

    const content = await response.arrayBuffer();
    console.log("2. Ficheiro lido com sucesso! Tamanho:", content.byteLength);

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const formatarMoeda = (v: number) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(v || 0);

    const dataAtualExtenso = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    console.log("3. A injetar dados do cliente...");

    doc.render({
      nome_empresa: cliente.nome,
      cnpj: cliente.cnpj || "Não informado",
      endereco: cliente.endereco || "Não informado",
      responsavel: cliente.responsavel || "Não informado",
      cpf: cliente.cpf || "Não informado",
      qtd_canais: cliente.qtd_canais || 1,
      qtd_usuarios: cliente.qtd_usuarios || 1,
      valor_total: formatarMoeda(cliente.valor_mensalidade),
      valor_implementacao: formatarMoeda(cliente.valor_implementacao),
      data_atual: dataAtualExtenso,
    });

    console.log("4. A gerar o ficheiro final...");

    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    saveAs(out, `Contrato_ChatClean_${cliente.nome.replace(/\s+/g, "_")}.docx`);
    console.log("5. Sucesso! Download iniciado.");
  } catch (error: any) {
    console.error("ERRO COMPLETO:", error);
    // Este alert vai dizer-nos exatamente qual é o problema
    alert("ERRO: " + error.message);
  }
};
