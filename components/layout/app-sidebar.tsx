"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Box,
  Zap,
  Bot,
  Wrench,
  Globe,
  Activity,
  Brain,
  BarChart3,
  Sparkles,
  Users,
  Plug,
  Building2,
  Settings,
  Construction 
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Devices", href: "/devices", icon: Box },
  { name: "Analytics & ML", href: "/analytics", icon: Brain },
  { name: "3D Energy Map", href: "/energy-map", icon: Globe },
  { name: "Power Systems", href: "/power-systems", icon: Zap },
  { name: "Building Systems", href: "/building-systems", icon: Building2 },
  { name: "Energy Champions", href: "/gamification", icon: Sparkles },
  { name: "Automation", href: "/automation", icon: Bot },
  { name: "Engineer View", href: "/engineer", icon: Wrench },
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Community", href: "/community", icon: Users },
  { name: "AI Assistant", href: "/assistant", icon: Bot },
  { name: "Sites", href: "/sites", icon: Construction },
  { name: "NGO & Policy", href: "/ngo", icon: Globe },
  { name: "Security", href: "/security", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Zap className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold text-foreground">EnergyMonitor</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@energy.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
