'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/utils/supabase/client"

// 1. Constantes de apoio
const VENDEDORES = [
  { id: 'v1', nome: 'Albert' },
  { id: 'v2', nome: 'Milton' },
  { id: 'v3', nome: 'Augusto' },
  { id: 'v4', nome: 'Eric' },
  { id: 'v5', nome: 'Lampião' },
  { id: 'v6', nome: 'Ederson' },
]

const CANAIS = [
  { id: 'c1', nome: '🤝 Indicação' },
  { id: 'c2', nome: '📢 Tráfego Pago' },
  { id: 'c3', nome: '🎪 Evento' },
  { id: 'c4', nome: '🌱 Orgânico' },
  { id: 'c5', nome: '🤲 Parceiro' },
  { id: 'c6', nome: '📌 Outro' },
]

// 2. Definição do Esquema (Ajustado para sincronizar 100% com o formulário)
const formSchema = z.object({
  nome: z.string().min(2, { message: "O nome é obrigatório." }),
  cnpj: z.string().optional(),
  responsavel: z.string().optional(),
  telefone: z.string().optional(),
  // Aceita um email válido, uma string vazia ou undefined
  email: z.string().email({ message: "E-mail inválido." }).or(z.literal('')).optional(),
  vendedor_id: z.string().optional(),
  canal_id: z.string().optional(),
  valor_mensalidade: z.coerce.number().min(0),
  dia_vencimento: z.coerce.number().min(1).max(31).or(z.literal(0)).optional(),
  // Sem .default() aqui, porque o React Hook Form já gere os defaultValues
  status: z.enum(["ativo", "cancelado", "congelado"]),
  data_inicio: z.string().optional(),
  data_aniversario: z.string().optional(),
  observacoes: z.string().optional(),
  status_contrato: z.enum(["aguardando", "assinado"]),
})

export function ClientForm({ onSuccess }: { onSuccess: () => void }) {
  const supabase = createClient()

  // 3. Inicialização limpa (O TypeScript agora vai concordar com isto naturalmente)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cnpj: "",
      responsavel: "",
      telefone: "",
      email: "",
      vendedor_id: "",
      canal_id: "c6",
      valor_mensalidade: 0,
      dia_vencimento: 10,
      status: "ativo",
      data_inicio: "",
      data_aniversario: "",
      observacoes: "",
      status_contrato: "aguardando",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingToastId = toast.loading("A guardar cliente...")

    const payload = {
      ...values,
      data_inicio: values.data_inicio || null,
      data_aniversario: values.data_aniversario || null,
    }

    const { error } = await supabase
      .from('clientes')
      .insert([payload])

    if (error) {
      console.error("Erro ao inserir:", error)
      toast.error("Erro ao guardar o cliente.", { id: loadingToastId })
      return
    }

    toast.success("Cliente adicionado com sucesso!", { id: loadingToastId })
    onSuccess() 
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Empresa *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da empresa" className="bg-slate-900 border-slate-700 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">CNPJ / CPF</FormLabel>
                <FormControl>
                  <Input placeholder="00.000.000/0001-00" className="bg-slate-900 border-slate-700 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Responsável</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do responsável" className="bg-slate-900 border-slate-700 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valor_mensalidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Mensalidade (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" className="bg-slate-900 border-slate-700 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dia_vencimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Dia Vencimento</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="31" className="bg-slate-900 border-slate-700 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="84 99999-9999" className="bg-slate-900 border-slate-700 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="email@empresa.com" className="bg-slate-900 border-slate-700 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vendedor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Vendedor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                    {VENDEDORES.map((vend) => (
                      <SelectItem key={vend.id} value={vend.id}>{vend.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="canal_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Canal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                    {CANAIS.map((canal) => (
                      <SelectItem key={canal.id} value={canal.id}>{canal.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="congelado">Congelado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status_contrato"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Contrato</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                    <SelectItem value="aguardando">Aguardando Assinatura</SelectItem>
                    <SelectItem value="assinado">Assinado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Data Início</FormLabel>
                <FormControl>
                  <Input type="date" className="bg-slate-900 border-slate-700 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_aniversario"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Aniversário</FormLabel>
                <FormControl>
                  <Input type="date" className="bg-slate-900 border-slate-700 text-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-xs text-slate-400 font-mono uppercase">Observações</FormLabel>
                <FormControl>
                  <Textarea className="bg-slate-900 border-slate-700 text-white min-h-[80px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
          <Button type="button" variant="ghost" onClick={onSuccess} className="hover:bg-slate-800 text-slate-300">
            Cancelar
          </Button>
          <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Guardar Cliente
          </Button>
        </div>
      </form>
    </Form>
  )
}