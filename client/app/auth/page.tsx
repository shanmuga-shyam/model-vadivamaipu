"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Brain, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-context"

type AuthMode = "login" | "signup"

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const auth = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      if (mode === "login") {
        await auth.login(email, password)
      } else {
        await auth.signup(email, password)
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-12">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-12 text-center justify-center hover:opacity-80 transition">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AutoML Insight
          </span>
        </Link>

        {/* Auth Card */}
        <Card className="border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl p-8">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-8 bg-muted/50 p-1 rounded-lg">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                mode === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                mode === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
              {mode === "login" && (
                <Link href="#" className="text-sm text-primary hover:text-accent mt-2 inline-block">
                  Forgot password?
                </Link>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>

            {mode === "login" && (
              <Button type="button" variant="outline" className="w-full gap-2 bg-transparent">
                Continue with Google
              </Button>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-foreground/60">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-primary hover:text-accent font-medium">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-primary hover:text-accent font-medium">
                  Sign in
                </button>
              </>
            )}
          </div>
        </Card>

        {/* Back Link */}
        <Link
          href="/"
          className="mt-6 flex items-center gap-2 text-foreground/60 hover:text-foreground transition justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
