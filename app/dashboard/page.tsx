"use client";

import Link from "next/link";
import { Bell, Settings, LogOut, ArrowUpRight, ArrowDownLeft, Plus, History, TrendingUp, TrendingDown } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import GoalCard from "@/components/ui/GoalCard";
import TransactionItem from "@/components/ui/TransactionItem";
import {
  MOCK_ACCOUNTS,
  MOCK_GOALS,
  MOCK_TRANSACTIONS,
  MOCK_BILLS,
  formatCurrency,
  formatCurrencyFull,
  getTotalBalance,
  getMonthlyIncome,
  getMonthlyExpense,
  getDaysRemaining,
} from "@/lib/utils";

export default function DashboardPage() {
  const totalBalance = getTotalBalance(MOCK_ACCOUNTS);
  const monthlyIncome = getMonthlyIncome(MOCK_TRANSACTIONS);
  const monthlyExpense = getMonthlyExpense(MOCK_TRANSACTIONS);
  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 4);
  const upcomingBills = MOCK_BILLS.filter((b) => b.status !== "paid").slice(0, 3);
  const topGoals = MOCK_GOALS.slice(0, 3);
  const netBalance = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? Math.round((netBalance / monthlyIncome) * 100) : 0;

  return (
    <div className="page-container" id="dashboard-page">
      {/* ── Header ────────────────────────────────────────── */}
      <div
        style={{
          padding: "calc(env(safe-area-inset-top, 0px) + 20px) 20px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="animate-fade-up"
      >
        <div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 2 }}>
            June 2025
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Welcome, Krishil
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/settings"
            className="header-icon-btn"
            id="dashboard-settings-btn"
            aria-label="Settings"
          >
            <Settings size={18} color="var(--text-secondary)" strokeWidth={1.8} />
          </Link>
          <Link
            href="/auth/signin"
            className="header-icon-btn"
            id="dashboard-logout-btn"
            aria-label="Notifications"
          >
            <Bell size={18} color="var(--text-secondary)" strokeWidth={1.8} />
          </Link>
        </div>
      </div>

      {/* ── Balance Card (Dark) ───────────────────────────── */}
      <div style={{ padding: "0 20px 24px" }}>
        <div
          className="card-dark animate-fade-up delay-100"
          id="balance-card"
          style={{ padding: "24px 22px" }}
        >
          {/* Card chip + number */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.08)",
                borderRadius: "var(--radius-full)",
                padding: "4px 10px 4px 8px",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 12,
                  background: "var(--green)",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: 8, height: 5, background: "rgba(0,0,0,0.3)", borderRadius: 1 }} />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.05em",
                }}
              >
                •••• 4521
              </span>
            </div>
          </div>

          {/* Balance Label */}
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500, marginBottom: 6 }}>
            My Balance
          </p>

          {/* Amount */}
          <p
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: "white",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "-0.02em",
              marginBottom: 28,
            }}
          >
            {formatCurrencyFull(totalBalance)}
          </p>

          {/* Monthly stats row */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 24,
              padding: "12px 14px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div style={{ flex: 1, borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                <TrendingUp size={12} color="var(--green)" />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Income</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--green)", fontFamily: "'JetBrains Mono', monospace" }}>
                {formatCurrency(monthlyIncome)}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                <TrendingDown size={12} color="var(--red)" />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Expenses</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--red)", fontFamily: "'JetBrains Mono', monospace" }}>
                {formatCurrency(monthlyExpense)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {[
              { icon: <Plus size={20} color="white" />, label: "Top up", href: "/add" },
              { icon: <ArrowUpRight size={20} color="white" />, label: "Send", href: "/contacts" },
              { icon: <ArrowDownLeft size={20} color="white" />, label: "Withdraw", href: "/accounts" },
              { icon: <History size={20} color="white" />, label: "History", href: "/transactions" },
            ].map(({ icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="action-btn"
                id={`dashboard-action-${label.toLowerCase().replace(" ", "-")}`}
                style={{ textDecoration: "none" }}
              >
                <div className="action-btn-circle">{icon}</div>
                <span className="action-btn-label">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Stats Row ───────────────────────────────── */}
      <div
        className="animate-fade-up delay-150"
        style={{
          padding: "0 20px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <div className="card" style={{ padding: "14px 16px" }}>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 6 }}>
            Savings Rate
          </p>
          <p
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: savingsRate >= 20 ? "var(--green)" : "var(--orange)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {savingsRate}%
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            Goal: ≥ 20%
          </p>
        </div>
        <div className="card" style={{ padding: "14px 16px" }}>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 6 }}>
            Net This Month
          </p>
          <p
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: netBalance >= 0 ? "var(--green)" : "var(--red)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "-0.01em",
            }}
          >
            {netBalance >= 0 ? "+" : "-"}{formatCurrency(Math.abs(netBalance))}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            Income − Expenses
          </p>
        </div>
      </div>

      {/* ── Bills Due Soon ────────────────────────────────── */}
      <div className="animate-fade-up delay-200">
        <div className="section-header">
          <h2 className="section-title">Bills due soon</h2>
          <Link href="/bills" className="section-link" id="dashboard-bills-viewall">
            View all &rsaquo;
          </Link>
        </div>
        <div style={{ padding: "0 20px", display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {upcomingBills.map((bill) => {
            const days = getDaysRemaining(bill.dueDate);
            const isOverdue = bill.status === "overdue";
            const isDueSoon = bill.status === "due_soon";
            return (
              <div
                key={bill.id}
                className="card"
                style={{
                  padding: "14px",
                  minWidth: 130,
                  flexShrink: 0,
                  borderLeft: `3px solid ${isOverdue ? "var(--red)" : isDueSoon ? "var(--orange)" : "var(--border)"}`,
                }}
                id={`bill-card-${bill.id}`}
              >
                <div style={{ fontSize: 22, marginBottom: 8 }}>{bill.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{bill.name}</p>
                <p style={{ fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-primary)", marginBottom: 4 }}>
                  {formatCurrency(bill.amount)}
                </p>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    background: isOverdue ? "var(--red-light)" : isDueSoon ? "var(--orange-light)" : "var(--bg-input)",
                    color: isOverdue ? "var(--red)" : isDueSoon ? "var(--orange)" : "var(--text-secondary)",
                  }}
                >
                  {isOverdue ? "Overdue" : days === 0 ? "Due today" : `${days}d left`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Savings Goals ─────────────────────────────────── */}
      <div className="animate-fade-up delay-250" style={{ marginTop: 24 }}>
        <div className="section-header">
          <h2 className="section-title">Your goals</h2>
          <Link href="/savings" className="section-link" id="dashboard-goals-viewall">
            View all &rsaquo;
          </Link>
        </div>
        <div style={{ padding: "0 20px" }}>
          {topGoals.map((goal, idx) => (
            <GoalCard key={goal.id} goal={goal} index={idx} />
          ))}
        </div>
      </div>

      {/* ── Recent Transactions ───────────────────────────── */}
      <div className="animate-fade-up delay-300" style={{ marginTop: 8 }}>
        <div className="section-header">
          <h2 className="section-title">Recent activity</h2>
          <Link href="/transactions" className="section-link" id="dashboard-tx-viewall">
            View all &rsaquo;
          </Link>
        </div>
        <div className="card" style={{ margin: "0 20px", padding: "4px 16px" }}>
          {recentTransactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      </div>

      <div style={{ height: 32 }} />
      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
