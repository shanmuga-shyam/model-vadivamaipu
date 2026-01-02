"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Brain, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { RobotMascot } from "@/components/robot-mascot"

type AuthMode = "login" | "signup"

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const router = useRouter()
  const auth = useAuth()

  type RobotVariant = "idle" | "grabbing" | "hiding" | "peeking"
  const robotVariant: RobotVariant =
    focusedField === "email"
      ? "grabbing"
      : focusedField === "password" && !showPassword
        ? "hiding"
        : focusedField === "password" && showPassword
          ? "peeking"
          : "idle"

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

      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-12">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      {/* Floating robot in the back */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="animate-robot-float opacity-80">
          <RobotMascot variant={robotVariant} />
        </div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent">
                AutoML
              </span>
            </Link>

            {/* Auth Card */}
            <Card className="border-accent/40 bg-card/80 backdrop-blur-xl shadow-2xl p-8 hover:border-accent/60 transition-all relative z-20">
              {/* Mode Tabs */}
              <div className="flex gap-2 mb-8 bg-muted/50 p-1 rounded-lg border border-accent/20">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold transition ${
                    mode === "login"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold transition ${
                    mode === "signup"
                      ? "bg-gradient-to-r from-cyan-400 to-cyan-500 text-white shadow-lg shadow-cyan-400/30"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 bg-background/50 border-accent/40 focus-visible:border-cyan-400 focus-visible:shadow-lg focus-visible:shadow-cyan-400/30 text-foreground placeholder:text-foreground/40"
                    />
                  </div>
                </div>

                {/* Name Field for Signup */}
                {mode === "signup" && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2 text-foreground">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className="pl-10 bg-background/50 border-accent/40 focus-visible:border-purple-500 focus-visible:shadow-lg focus-visible:shadow-purple-500/30 text-foreground placeholder:text-foreground/40"
                      />
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold mb-2 text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 pr-12 bg-background/50 border-accent/40 focus-visible:border-orange-500 focus-visible:shadow-lg focus-visible:shadow-orange-500/30 text-foreground placeholder:text-foreground/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-orange-500 transition"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mode === "login" && (
                    <Link href="#" className="text-sm text-orange-500 hover:text-cyan-400 mt-2 inline-block font-medium transition">
                      Forgot password?
                    </Link>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive font-medium">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-lg font-semibold py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/50 text-white"
                  size="lg"
                >
                  {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
                </Button>

                {mode === "login" && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 border-accent/40 hover:border-cyan-400 hover:bg-cyan-400/10 font-medium"
                  >
                    Continue with Google
                  </Button>
                )}
              </form>

              {/* Footer */}
              <div className="mt-6 text-center text-sm text-foreground/60">
                {mode === "login" ? (
                  <>
                    Don't have an account? {""}
                    <button
                      onClick={() => setMode("signup")}
                      className="text-orange-500 hover:text-cyan-400 font-semibold transition"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account? {""}
                    <button
                      onClick={() => setMode("login")}
                      className="text-orange-500 hover:text-cyan-400 font-semibold transition"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </Card>

            {/* Back Link */}
            <Link
              href="/"
              className="mt-6 flex items-center gap-2 text-foreground/60 hover:text-foreground transition justify-center font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes robotFloatAround {
          0% { transform: translate(-80px, -40px) scale(1); }
          25% { transform: translate(120px, -20px) scale(1.05); }
          50% { transform: translate(160px, 60px) scale(0.98); }
          75% { transform: translate(-100px, 80px) scale(1.02); }
          100% { transform: translate(-140px, -20px) scale(1); }
        }

        .animate-robot-float {
          animation: robotFloatAround 16s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}
