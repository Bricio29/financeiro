import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner"; // <-- Importe aqui

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatClean | Financeiro & CRM",
  description: "Sistema de Gestão Financeira e CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${inter.className} flex min-h-screen bg-slate-900 text-slate-50`}
      >
        <Sidebar />

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 border-b border-slate-800 bg-slate-950/50 flex items-center px-8">
            <h1 className="text-sm text-slate-400 font-medium">
              Ambiente de Gestão
            </h1>
          </header>

          <div className="flex-1 overflow-auto p-8">{children}</div>
        </main>

        {/* Adicione o Toaster aqui no final */}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
