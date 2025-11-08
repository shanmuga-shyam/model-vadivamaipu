"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { User, Moon, Sun, Monitor, Bell, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("profile")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "theme", label: "Appearance", icon: Moon },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-foreground/60">Manage your account and preferences</p>
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
              <Input type="text" defaultValue="John Doe" className="bg-background/50 border-border/50" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input type="email" defaultValue="john@example.com" className="bg-background/50 border-border/50" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                defaultValue="ML enthusiast and data scientist"
                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:border-primary resize-none"
                rows={3}
              />
            </div>

            <Button>Save Changes</Button>
          </Card>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === "theme" && (
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Theme Preference</h2>
            <div className="space-y-3">
              {[
                { value: "light", label: "Light Mode", icon: Sun },
                { value: "dark", label: "Dark Mode", icon: Moon },
                { value: "system", label: "System Default", icon: Monitor },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-lg border-2 transition",
                    theme === value ? "border-primary bg-primary/5" : "border-border/40 hover:border-border/60",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{label}</p>
                    <p className="text-xs text-foreground/60">
                      {value === "system" ? "Use your system settings" : `Always use ${label.toLowerCase()}`}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2",
                      theme === value ? "border-primary bg-primary" : "border-border",
                    )}
                  />
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Password */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Password & Security</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <Input type="password" placeholder="••••••••" className="bg-background/50 border-border/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <Input type="password" placeholder="••••••••" className="bg-background/50 border-border/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <Input type="password" placeholder="••••••••" className="bg-background/50 border-border/50" />
              </div>
              <Button>Update Password</Button>
            </div>
          </Card>

          {/* Sessions */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/40">
                <div>
                  <p className="font-medium text-sm">Current Session</p>
                  <p className="text-xs text-foreground/60">Chrome on Windows • Last active now</p>
                </div>
                <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">Active</span>
              </div>
            </div>
            <Button variant="outline" className="mt-4 bg-transparent">
              Log Out Other Sessions
            </Button>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30 bg-destructive/5 p-6">
            <h2 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h2>
            <p className="text-sm text-foreground/60 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                Delete Account
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-medium">Are you sure? This cannot be undone.</p>
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={() => setShowDeleteConfirm(false)}>
                    Confirm Delete
                  </Button>
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { label: "Analysis Complete", description: "Notify when model evaluation finishes" },
                { label: "Daily Summary", description: "Get a daily summary of your activities" },
                { label: "New Features", description: "Be notified about new platform features" },
                { label: "Tips & Updates", description: "Receive tips and best practices for ML" },
              ].map((notif) => (
                <div
                  key={notif.label}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/40"
                >
                  <div>
                    <p className="font-medium text-sm">{notif.label}</p>
                    <p className="text-xs text-foreground/60">{notif.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              ))}
            </div>
            <Button className="mt-6">Save Preferences</Button>
          </Card>
        </div>
      )}
    </div>
  )
}
