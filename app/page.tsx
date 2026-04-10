"use client"

import { useEffect, useState } from "react"
import { AuthScreen } from "@/components/wallet/auth-screen"
import { WalletApp } from "@/components/wallet/wallet-app"

type AuthUser = {
  email: string
  id: string
  name: string
}

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (!storedToken || !storedUser) {
      setIsHydrated(true)
      return
    }

    try {
      const parsedUser: AuthUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setIsAuthenticated(true)
    } catch {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    } finally {
      setIsHydrated(true)
    }
  }, [])

  const handleLogin = (nextUser: AuthUser) => {
    setUser(nextUser)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
  }

  if (!isHydrated) {
    return null
  }

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />
  }

  return <WalletApp user={user!} onLogout={handleLogout} />
}
