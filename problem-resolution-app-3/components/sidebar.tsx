"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  AlertCircle,
  Users,
  FileText,
  BarChart3,
  Settings,
  ClipboardCheck,
  UserCog,
  FileCheck,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard, roles: ["all"] },
  { name: "Problèmes", href: "/dashboard/problems", icon: AlertCircle, roles: ["all"] },
  { name: "Signalement", href: "/dashboard/operateur", icon: Bell, roles: ["Opérateur"] },
  { name: "Formulaire Superviseur", href: "/dashboard/superviseur", icon: ClipboardCheck, roles: ["Superviseur"] },
  { name: "Formulaire Chef Équipe", href: "/dashboard/chef-equipe", icon: UserCog, roles: ["Chef d'équipe"] },
  { name: "Formulaire Responsable", href: "/dashboard/responsable", icon: FileCheck, roles: ["Responsable"] },
  { name: "Validation 8D", href: "/dashboard/manager/validation", icon: FileText, roles: ["Manager"] },
  { name: "Équipes", href: "/dashboard/teams", icon: Users, roles: ["Manager"] },
  { name: "Rapports", href: "/dashboard/reports", icon: FileText, roles: ["Responsable", "Manager"] },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["Responsable", "Manager"] },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings, roles: ["Manager"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavigation = navigation.filter(
    (item) => item.roles.includes("all") || (user && item.roles.includes(user.role)),
  )

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar overflow-y-auto">
      <nav className="flex flex-col gap-1 p-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
  