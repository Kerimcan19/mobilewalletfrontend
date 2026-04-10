"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type FilterType = "all" | "income" | "expense"

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token")
        const userId = localStorage.getItem("userId") // 🔥 CRITICAL

        const res = await fetch("http://localhost:5000/api/transaction", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.message)

        const raw = data.data ?? data

        const normalized = raw.map((t: any) => {
          const isIncome = t.receiverId === userId
          const isExpense = t.senderId === userId

          return {
            id: t.id,
            amount: Number(t.amount),

            // 🔥 MAIN FIX (REAL BANK LOGIC)
            type: isIncome ? "income" : "expense",

            date: new Date(t.createdAt).toLocaleDateString(),
            name: t.type,
            category: t.status,
          }
        })

        setTransactions(normalized)
      } catch (err) {
        console.error("Transaction fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "income" && t.type === "income") ||
      (filter === "expense" && t.type === "expense")

    const matchesSearch =
      t.name?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading transactions...
      </div>
    )
  }

  return (
    <div className="p-4 space-y-5">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold">Transactions</h2>
        <p className="text-sm text-muted-foreground">
          Your transaction history
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-3">

        <Card className="border-0 shadow-sm bg-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownLeft className="w-4 h-4 text-primary" />
              <span className="text-sm">Income</span>
            </div>
            <p className="text-lg font-bold text-primary">
              +${totalIncome.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-destructive/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-destructive" />
              <span className="text-sm">Expenses</span>
            </div>
            <p className="text-lg font-bold text-destructive">
              -${totalExpenses.toFixed(2)}
            </p>
          </CardContent>
        </Card>

      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          className="pl-10 h-11"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* FILTER */}
      <div className="flex gap-2">

        <Button
          variant={filter === "all" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setFilter("all")}
        >
          All
        </Button>

        <Button
          variant={filter === "income" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setFilter("income")}
        >
          Income
        </Button>

        <Button
          variant={filter === "expense" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setFilter("expense")}
        >
          Expense
        </Button>

      </div>

      {/* LIST */}
      <div className="space-y-3">

        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No transactions found
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((t) => (
            <Card key={t.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">

                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    t.type === "income"
                      ? "bg-primary/10"
                      : "bg-destructive/10"
                  }`}
                >
                  {t.type === "income" ? (
                    <ArrowDownLeft className="w-5 h-5 text-primary" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-destructive" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.date} • {t.category}
                  </p>
                </div>

                <p
                  className={`font-semibold ${
                    t.type === "income"
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}$
                  {Math.abs(t.amount).toFixed(2)}
                </p>

              </CardContent>
            </Card>
          ))
        )}

      </div>
    </div>
  )
}