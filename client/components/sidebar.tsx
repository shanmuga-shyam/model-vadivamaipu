"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Brain, LayoutDashboard, History, Settings, LogOut, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-context"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const auth = (() => {
    try {
      return useAuth()
    } catch (e) {
      return null
    }
  })()

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/results", icon: History, label: "Results" },
    { href: "/dashboard/history", icon: History, label: "History" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    if (auth) {
      await auth.logout()
      router.push("/auth")
    }
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AutoML
            </span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-sidebar-accent rounded-md transition">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* New Analysis Button */}
      <div className="p-4 border-b border-sidebar-border">
        <Button size="sm" className="w-full gap-2" asChild>
          <Link href="/dashboard">
            <Plus className="w-4 h-4" />
            {!collapsed && "New Analysis"}
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition",
              isActive(item.href)
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button variant="ghost" size="sm" className="w-full gap-2 justify-start" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </aside>
  )
}
