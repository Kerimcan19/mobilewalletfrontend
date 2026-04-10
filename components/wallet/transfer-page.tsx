"use client"

import { useState } from "react"
import { Send, User, DollarSign, FileText, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

const quickAmounts = [25, 50, 100, 250]

export function TransferPage() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSuccess(true)
    
    // Reset after showing success
    setTimeout(() => {
      setIsSuccess(false)
      setRecipient("")
      setAmount("")
      setNote("")
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Transfer Successful!</h2>
        <p className="text-muted-foreground text-center">
          ${amount} has been sent to {recipient}
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Transfer Money</h2>
        <p className="text-sm text-muted-foreground">Send money to anyone instantly</p>
      </div>

      {/* Balance Info */}
      <Card className="border-0 shadow-sm bg-muted/50">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-xl font-bold text-foreground">$12,458.50</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Transfer Form */}
      <form onSubmit={handleTransfer} className="space-y-4">
        <Field>
          <FieldLabel>Recipient</FieldLabel>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Email or phone number"
              className="pl-10 h-12 bg-card border-border"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
        </Field>

        <Field>
          <FieldLabel>Amount</FieldLabel>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="0.00"
              className="pl-10 h-12 bg-card border-border text-lg font-semibold"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
              step="0.01"
            />
          </div>
        </Field>

        {/* Quick Amount Buttons */}
        <div className="flex gap-2">
          {quickAmounts.map((quickAmount) => (
            <Button
              key={quickAmount}
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setAmount(quickAmount.toString())}
            >
              ${quickAmount}
            </Button>
          ))}
        </div>

        <Field>
          <FieldLabel>Note (Optional)</FieldLabel>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Textarea
              placeholder="Add a note..."
              className="pl-10 min-h-[80px] bg-card border-border resize-none"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </Field>

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium mt-4"
          disabled={isLoading || !recipient || !amount}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Money
            </span>
          )}
        </Button>
      </form>
    </div>
  )
}
