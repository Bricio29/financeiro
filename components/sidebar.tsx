import Link from 'next/link'
import { LayoutDashboard, Users, DollarSign, TrendingUp, Settings, MessageSquare } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clientes (CRM)', href: '/clientes', icon: Users },
  { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { name: 'Vendas', href: '/vendas', icon: TrendingUp },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-300">
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <div className="flex items-center gap-2 font-bold text-white">
          <MessageSquare className="h-6 w-6 text-emerald-500" />
          <span className="text-xl">ChatClean</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-emerald-400"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-900 p-3">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
            FW
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Admin</span>
            <span className="text-xs text-slate-500">Sistema</span>
          </div>
        </div>
      </div>
    </aside>
  )
}