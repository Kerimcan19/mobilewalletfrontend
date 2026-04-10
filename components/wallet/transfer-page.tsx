"use client"

import { useEffect, useState } from "react"
import { Send, User, DollarSign, FileText, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { buildApiUrl } from "@/lib/api"

const quickAmounts = [25, 50, 100, 250]

export function TransferPage() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")

  const [balance, setBalance] = useState<number>(0)

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null

  // 🔥 WALLET FETCH
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch(buildApiUrl("/api/wallet"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        setBalance(data.data?.balance ?? data.balance ?? 0)
      } catch (err) {
        console.log("Wallet error:", err)
      }
    }

    fetchWallet()
  }, [token])

  // 🔥 TRANSFER
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch(
        buildApiUrl("/api/transaction/transfer"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiverEmail: recipient,
            amount: Number(amount),
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      // 🔥 balance update
      setBalance(data.data.senderBalance)

      setIsSuccess(true)

      setTimeout(() => {
        setIsSuccess(false)
        setRecipient("")
        setAmount("")
        setNote("")
      }, 2000)

    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // SUCCESS SCREEN
  if (isSuccess) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Transfer Successful!</h2>
        <p className="text-muted-foreground text-center">
          ${amount} sent to {recipient}
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-5">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold">Transfer Money</h2>
        <p className="text-sm text-muted-foreground">
          Send money instantly
        </p>
      </div>

      {/* BALANCE */}
      <Card className="border-0 shadow-sm bg-muted/50">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Available Balance
            </p>
            <p className="text-xl font-bold">
              ${Number(balance).toFixed(2)}
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* FORM */}
      <form onSubmit={handleTransfer} className="space-y-4">

        {/* RECIPIENT */}
        <Field>
          <FieldLabel>Recipient</FieldLabel>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Email"
              className="pl-10 h-12"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
        </Field>

        {/* AMOUNT */}
        <Field>
          <FieldLabel>Amount</FieldLabel>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              className="pl-10 h-12 text-lg font-semibold"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
              step="0.01"
            />
          </div>
        </Field>

        {/* QUICK AMOUNTS */}
        <div className="flex gap-2">
          {quickAmounts.map((q) => (
            <Button
              key={q}
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setAmount(q.toString())}
            >
              ${q}
            </Button>
          ))}
        </div>

        {/* NOTE */}
        <Field>
          <FieldLabel>Note</FieldLabel>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Textarea
              className="pl-10 min-h-[80px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </Field>

        {/* SUBMIT */}
        <Button
          type="submit"
          className="w-full h-12"
          disabled={isLoading || !recipient || !amount}
        >
          {isLoading ? "Processing..." : "Send Money"}
        </Button>

      </form>
    </div>
  )
}