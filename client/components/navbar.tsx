"use client"

import { Moon, Sun, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-context"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const auth = (() => {
    try {
      return useAuth()
    } catch (e) {
      return null
    }
  })()

  const handleLogout = async () => {
    if (auth) {
      await auth.logout()
      router.push("/auth")
    }
  }

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

          {/* User Avatar with Menu */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/60">{auth?.user?.email || "User"}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(auth?.user?.email || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  )
}
