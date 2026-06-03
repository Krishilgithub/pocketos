"use client";

import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import { MOCK_ACCOUNTS, formatCurrency, getTotalBalance } from "@/lib/utils";
import { Account } from "@/lib/types";
import { ChevronRight, Plus, ArrowLeftRight } from "lucide-react";

function AccountCard({ account, index }: { account: Account; index: number }) {
  const isCreditCard = account.type === "credit";
  const balance = Math.abs(account.balance);
  const creditPct = isCreditCard && account.limit
    ? Math.round((balance / account.limit) * 100)
    : 0;

  return (
    <div
      className="card"
      id={`account-${account.id}`}
      style={{
        padding: "18px 16px",
        marginBottom: 12,
        borderLeft: `4px solid ${account.color}`,
        opacity: 0,
        animation: `fadeInUp 0.4s ease forwards`,
        animationDelay: `${index * 80}ms`,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Icon */}
        <div
          className="icon-circle"
          style={{
            width: 48,
            height: 48,
            background: account.color + "18",
            fontSize: 22,
          }}
        >
          {account.icon}
        </div>

        {/* Details */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>
            {account.name}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            {account.type === "bank" && account.lastFour ? `••• ${account.lastFour}` : account.type}
            {account.type === "credit" && account.limit ? ` · Limit ${formatCurrency(account.limit)}` : ""}
          </p>
        </div>

        {/* Balance */}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 18,
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              color: isCreditCard ? "var(--red)" : "var(--text-primary)",
              marginBottom: isCreditCard ? 4 : 0,
            }}
          >
            {isCreditCard ? "-" : ""}{formatCurrency(balance)}
          </p>
          {isCreditCard && account.limit && (
            <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {formatCurrency(account.limit - balance)} available
            </p>
          )}
        </div>

        <ChevronRight size={16} color="var(--text-muted)" />
      </div>

      {/* Credit card progress */}
      {isCreditCard && account.limit && (
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 4, background: "var(--bg-input)", borderRadius: 99, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${creditPct}%`,
                background: creditPct > 80 ? "var(--red)" : creditPct > 50 ? "var(--orange)" : "var(--blue)",
                borderRadius: 99,
                transition: "width 0.8s ease",
              }}
            />
          </div>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
            {creditPct}% of credit limit used
          </p>
        </div>
      )}
    </div>
  );
}

export default function AccountsPage() {
  const netWorth = getTotalBalance(MOCK_ACCOUNTS);

  return (
    <div className="page-container" id="accounts-page">
      <PageHeader
        title="Accounts"
        rightAction={
          <button className="header-icon-btn" aria-label="Add account" id="accounts-add-btn">
            <Plus size={18} color="var(--text-primary)" strokeWidth={2.5} />
          </button>
        }
      />

      <div style={{ padding: "0 20px" }}>
        {/* ── Net Worth Summary ──────────────────────── */}
        <div
          className="card-dark animate-fade-up"
          style={{ padding: "22px", marginBottom: 24 }}
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>Net Worth</p>
          <p
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "white",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            {formatCurrency(netWorth)}
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Assets</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", fontFamily: "'JetBrains Mono', monospace" }}>
                {formatCurrency(MOCK_ACCOUNTS.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0))}
              </p>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Liabilities</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--red)", fontFamily: "'JetBrains Mono', monospace" }}>
                {formatCurrency(Math.abs(MOCK_ACCOUNTS.filter((a) => a.balance < 0).reduce((s, a) => s + a.balance, 0)))}
              </p>
            </div>
          </div>
        </div>

        {/* ── Transfer Button ────────────────────────── */}
        <button
          className="btn-secondary animate-fade-up delay-100"
          id="accounts-transfer-btn"
          style={{ marginBottom: 20, gap: 8 }}
        >
          <ArrowLeftRight size={18} />
          Transfer Between Accounts
        </button>

        {/* ── Account Cards ──────────────────────────── */}
        <h2
          className="animate-fade-up delay-150"
          style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}
        >
          All Accounts
        </h2>
        {MOCK_ACCOUNTS.map((account, idx) => (
          <AccountCard key={account.id} account={account} index={idx} />
        ))}
      </div>

      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
