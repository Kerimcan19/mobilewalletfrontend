"use client"

import { useEffect, useState } from "react"
import { Send, Plus, ArrowUpRight, ArrowDownLeft, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WalletDashboardProps {
  onNavigate: (page: "wallet" | "transactions" | "transfer" | "settings") => void
}

export function WalletDashboard({ onNavigate }: WalletDashboardProps) {
  const [wallet, setWallet] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch("http://localhost:5000/api/wallet", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch wallet")
        }

setWallet(data.data ?? data)
      } catch (err) {
        console.error("Wallet fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [])

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading wallet...
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-sidebar to-sidebar/90 border-0 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sidebar-foreground/70 text-sm">Total Balance</p>
              <h2 className="text-3xl font-bold text-sidebar-foreground mt-1">
                ${wallet?.balance?.toFixed(2) || "0.00"}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-sidebar-primary/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-sidebar-primary" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 rounded-full bg-sidebar-primary/20 text-sidebar-primary font-medium">
              +{wallet?.changePercent || 0}%
            </span>
            <span className="text-sidebar-foreground/60">vs last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="outline"
          className="h-auto flex-col gap-3 py-5 bg-card border-border hover:bg-muted"
          onClick={() => onNavigate("transfer")}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Send className="w-5 h-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">Send Money</p>
            <p className="text-xs text-muted-foreground mt-0.5">Para Gönder</p>
          </div>
        </Button>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>

          <button
            onClick={() => onNavigate("transactions")}
            className="text-sm text-primary font-medium hover:underline"
          >
            See All
          </button>
        </div>

        <div className="space-y-3">
          {wallet?.transactions?.map((transaction: any) => (
            <Card
              key={transaction.id}
              className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.type === "income"
                      ? "bg-primary/10"
                      : "bg-destructive/10"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowDownLeft className="w-5 h-5 text-primary" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-destructive" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {transaction.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.date}
                  </p>
                </div>

                <p
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                >
                  {transaction.type === "income" ? "+" : ""}
                  ${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}