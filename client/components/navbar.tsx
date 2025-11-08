"use client"

import { Moon, Sun, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-20 right-0 h-16 bg-background border-b border-border/40 backdrop-blur-sm z-30 md:left-64">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {/* User Avatar */}
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  )
}
