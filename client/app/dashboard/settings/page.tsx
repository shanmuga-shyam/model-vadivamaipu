"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth-context"
import { User, Moon, Sun, Monitor, Bell, Shield, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const auth = (() => {
    try {
      return useAuth()
    } catch (e) {
      return null
    }
  })()
  const [activeTab, setActiveTab] = useState("profile")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    name: auth?.user?.email?.split("@")[0] || "User",
    email: auth?.user?.email || "user@example.com",
    bio: "ML enthusiast and data scientist",
  })

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "theme", label: "Appearance", icon: Moon },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-foreground/60">Manage your account and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b-2 transition font-medium text-sm",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/60 hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Avatar */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl">
                JD
              </div>
              <div className="space-y-2">
                <Button>Change Picture</Button>
                <p className="text-xs text-foreground/60">JPG, PNG or GIF (Max 5MB)</p>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background/50 border-border/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background/50 border-border/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <Input
                type="text"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="bg-background/50 border-border/50"
              />
            </div>

            <Button className="w-full">Save Changes</Button>
          </Card>
        </div>
      )}

      {/* Theme Tab */}
      {activeTab === "theme" && (
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Theme Preference</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor },
              ].map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition",
                      theme === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border/40 hover:border-primary/50",
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Password</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <Input
                type="password"
                placeholder="Enter current password"
                className="bg-background/50 border-border/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                className="bg-background/50 border-border/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                className="bg-background/50 border-border/50"
              />
            </div>
            <Button className="w-full">Update Password</Button>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
            <p className="text-sm text-foreground/60">Add an extra layer of security to your account</p>
            <Button variant="outline" className="w-full">
              Enable 2FA
            </Button>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 space-y-4 border-red-500/50">
            <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
            <p className="text-sm text-foreground/60">Permanently delete your account and all associated data</p>
            <Button
              variant="outline"
              className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          </Card>

          {showDeleteConfirm && (
            <Card className="border-red-500 bg-red-500/10 p-4">
              <p className="text-sm mb-4">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/20">
                  Confirm Delete
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Email Notifications</h2>

            {[
              { title: "Model Training Updates", description: "Get notified when your models finish training" },
              { title: "Weekly Reports", description: "Receive weekly performance summaries" },
              { title: "Important Alerts", description: "Critical system messages and security alerts" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/40">
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-foreground/60">{item.description}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
            ))}

            <Button className="w-full">Save Preferences</Button>
          </Card>
        </div>
      )}
    </div>
  )
}
