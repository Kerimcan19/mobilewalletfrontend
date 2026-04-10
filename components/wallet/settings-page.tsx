"use client"

import { useState } from "react"
import { User, Lock, LogOut, ChevronRight, Shield, Bell, HelpCircle, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SettingsPageProps {
  user: { email: string; name: string }
  onLogout: () => void
}

const settingsItems = [
  { id: "security", icon: Shield, label: "Security", description: "Two-factor auth, login alerts" },
  { id: "notifications", icon: Bell, label: "Notifications", description: "Push & email preferences" },
  { id: "help", icon: HelpCircle, label: "Help & Support", description: "FAQ, contact support" },
]

export function SettingsPage({ user, onLogout }: SettingsPageProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account</p>
      </div>

      {/* Profile Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground uppercase">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {user.email}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Dialog>
        <DialogTrigger asChild>
          <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your password</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and new password.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Field>
              <FieldLabel>Current Password</FieldLabel>
              <Input
                type="password"
                placeholder="Enter current password"
                className="h-11"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>New Password</FieldLabel>
              <Input
                type="password"
                placeholder="Enter new password"
                className="h-11"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Confirm New Password</FieldLabel>
              <Input
                type="password"
                placeholder="Confirm new password"
                className="h-11"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Field>
            <Button className="w-full h-11">Update Password</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Settings Toggle */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Push Notifications</p>
            <p className="text-sm text-muted-foreground">Receive transaction alerts</p>
          </div>
          <Switch
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </CardContent>
      </Card>

      {/* Other Settings */}
      <div className="space-y-2">
        {settingsItems.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.id} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Logout Button */}
      <Button
        variant="destructive"
        className="w-full h-12"
        onClick={onLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>

      {/* App Version */}
      <p className="text-center text-xs text-muted-foreground">
        WalletApp v1.0.0
      </p>
    </div>
  )
}
