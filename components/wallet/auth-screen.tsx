"use client"

import { useState } from "react"
import { Wallet, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"

type AuthUser = {
  email: string
  id: string
  name: string
}

type AuthResponse = {
  token?: string
  user?: AuthUser
  data?: {
    token?: string
    user?: AuthUser
  }
  accessToken?: string
  message?: string
}

interface AuthScreenProps {
  onLogin: (user: AuthUser) => void
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")

  const getAuthPayload = (data: AuthResponse) => {
    const token = data.token ?? data.accessToken ?? data.data?.token
    const user = data.user ?? data.data?.user

    return { token, user }
  }

  const authenticateUser = async (requestUrl: string, payload: Record<string, unknown>) => {
    const res = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data: AuthResponse = await res.json()

    if (!res.ok) {
      throw new Error(data.message || "Auth failed")
    }

    return getAuthPayload(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const authUrl = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register"
      const loginUrl = "http://localhost:5000/api/auth/login"

      const payload = isLogin
        ? { email, password }
        : { name, email, password, confirmPassword }

      let { token, user } = await authenticateUser(authUrl, payload)

      if (!isLogin && (!token || !user)) {
        ;({ token, user } = await authenticateUser(loginUrl, { email, password }))
      }

      if (!token || !user) {
        throw new Error("Auth response is missing token or user")
      }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      onLogin(user)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Auth failed"
      alert(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[375px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">WalletApp</h1>
          <p className="text-muted-foreground text-sm mt-1">Your digital wallet</p>
        </div>

        {/* Auth Card */}
        <Card className="border-0 shadow-xl bg-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin
                ? "Sign in to access your wallet"
                : "Sign up to get started with WalletApp"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Toggle Buttons */}
            <div className="flex bg-muted rounded-lg p-1 mb-6">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field>
                <FieldLabel>Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 h-12 bg-muted/50 border-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="pl-10 pr-10 h-12 bg-muted/50 border-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </Field>

              {!isLogin && (
                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="pl-10 h-12 bg-muted/50 border-0"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </Field>
              )}
              {!isLogin && (
  <Field>
    <FieldLabel>Name and Surname</FieldLabel>
    <div className="relative">
      <Input
        type="text"
        placeholder="Your name"
        className="h-12 bg-muted/50 border-0"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
    </div>
  </Field>
)}

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
