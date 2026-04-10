"use client"

import { useState } from "react"
import { AuthScreen } from "@/components/wallet/auth-screen"
import { WalletApp } from "@/components/wallet/wallet-app"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  const handleLogin = (email: string) => {
    setUser({ email, name: email.split("@")[0] })
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />
  }

  return <WalletApp user={user!} onLogout={handleLogout} />
}
