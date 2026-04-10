"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const allTransactions = [
  { id: 1, name: "Netflix Subscription", amount: -15.99, date: "Apr 10, 2026", type: "expense", category: "Entertainment" },
  { id: 2, name: "Salary Deposit", amount: 3500.0, date: "Apr 9, 2026", type: "income", category: "Salary" },
  { id: 3, name: "Coffee Shop", amount: -4.5, date: "Apr 9, 2026", type: "expense", category: "Food" },
  { id: 4, name: "Freelance Payment", amount: 250.0, date: "Apr 8, 2026", type: "income", category: "Freelance" },
  { id: 5, name: "Grocery Store", amount: -85.32, date: "Apr 7, 2026", type: "expense", category: "Groceries" },
  { id: 6, name: "Electric Bill", amount: -120.0, date: "Apr 6, 2026", type: "expense", category: "Utilities" },
  { id: 7, name: "Client Payment", amount: 500.0, date: "Apr 5, 2026", type: "income", category: "Freelance" },
  { id: 8, name: "Gas Station", amount: -45.0, date: "Apr 4, 2026", type: "expense", category: "Transport" },
  { id: 9, name: "Amazon Purchase", amount: -67.99, date: "Apr 3, 2026", type: "expense", category: "Shopping" },
  { id: 10, name: "Refund", amount: 25.0, date: "Apr 2, 2026", type: "income", category: "Refund" },
]

type FilterType = "all" | "income" | "expense"

export function TransactionsPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = allTransactions.filter((t) => {
    const matchesFilter = filter === "all" || t.type === filter
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalIncome = allTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = allTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Transactions</h2>
        <p className="text-sm text-muted-foreground">Your transaction history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm bg-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownLeft className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Income</span>
            </div>
            <p className="text-lg font-bold text-primary">+${totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-destructive/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
            <p className="text-lg font-bold text-destructive">-${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          className="pl-10 h-11 bg-card border-border"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="flex-1"
        >
          <Filter className="w-4 h-4 mr-1" />
          All
        </Button>
        <Button
          variant={filter === "income" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("income")}
          className="flex-1"
        >
          Income
        </Button>
        <Button
          variant={filter === "expense" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("expense")}
          className="flex-1"
        >
          Expense
        </Button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{transaction.date}</span>
                    <span>•</span>
                    <span>{transaction.category}</span>
                  </div>
                </div>
                <p
                  className={`font-semibold shrink-0 ${
                    transaction.type === "income"
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
