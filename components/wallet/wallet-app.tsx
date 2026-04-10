"use client"

import { useState } from "react"
import { Menu, X, Wallet, ArrowRightLeft, Send, Settings, ChevronRight, Landmark } from "lucide-react"
import { WalletDashboard } from "./wallet-dashboard"
import { TransactionsPage } from "./transactions-page"
import { TransferPage } from "./transfer-page"
import { SettingsPage } from "./settings-page"

interface WalletAppProps {
  user: { email: string; name: string }
  onLogout: () => void
}

type Page = "wallet" | "transactions" | "transfer" | "settings"

const menuItems: { id: Page; label: string; labelTr: string; icon: React.ElementType }[] = [
  { id: "wallet", label: "Wallet", labelTr: "Cüzdanım", icon: Wallet },
  { id: "transactions", label: "Transactions", labelTr: "İşlemler", icon: ArrowRightLeft },
  { id: "transfer", label: "Transfer", labelTr: "Transfer", icon: Send },
  { id: "settings", label: "Settings", labelTr: "Ayarlar", icon: Settings },
]

export function WalletApp({ user, onLogout }: WalletAppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<Page>("wallet")

  const handleNavigate = (page: Page) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "wallet":
        return <WalletDashboard onNavigate={handleNavigate} />
      case "transactions":
        return <TransactionsPage />
      case "transfer":
        return <TransferPage />
      case "settings":
        return <SettingsPage user={user} onLogout={onLogout} />
      default:
        return <WalletDashboard onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[375px] h-[700px] bg-card rounded-3xl shadow-2xl overflow-hidden relative flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-sidebar px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-sidebar-accent transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-sidebar-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-sidebar-primary" />
            <span className="font-semibold text-sidebar-foreground">WalletApp</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-foreground uppercase">
              {user.name.charAt(0)}
            </span>
          </div>
        </header>

        {/* Sidebar Overlay */}
        <div
          className={`fixed inset-0 bg-foreground/50 z-40 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-full w-[280px] bg-sidebar z-50 transform transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-sidebar-primary flex items-center justify-center">
                <span className="text-lg font-semibold text-sidebar-primary-foreground uppercase">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-sidebar-foreground">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  <span className="text-xs opacity-60">{item.labelTr}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
