"use client";

import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import TransactionItem from "@/components/ui/TransactionItem";
import FAB from "@/components/layout/FAB";
import { MOCK_TRANSACTIONS, getMonthlyIncome, getMonthlyExpense, formatCurrency } from "@/lib/utils";
import { Transaction } from "@/lib/types";

const FILTER_TABS = ["All", "Income", "Expense"];
const DATE_FILTERS = ["Today", "This Week", "This Month", "Custom"];

function groupByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  transactions.forEach((tx) => {
    const key = tx.date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });
  return groups;
}

export default function TransactionsPage() {
  const [activeType, setActiveType] = useState("All");
  const [activePeriod, setActivePeriod] = useState("This Month");

  const filtered = MOCK_TRANSACTIONS.filter((tx) => {
    if (activeType === "Income") return tx.type === "income";
    if (activeType === "Expense") return tx.type === "expense";
    return true;
  });

  const grouped = groupByDate(filtered);
  const totalIncome = getMonthlyIncome(MOCK_TRANSACTIONS);
  const totalExpense = getMonthlyExpense(MOCK_TRANSACTIONS);

  return (
    <div className="page-container" id="transactions-page">
      <PageHeader
        title="Transactions"
        rightAction={
          <button className="header-icon-btn" aria-label="Search" id="transactions-search-btn">
            <Search size={18} color="var(--text-primary)" strokeWidth={1.8} />
          </button>
        }
      />

      <div style={{ padding: "0 20px" }}>
        {/* ── Summary Card ────────────────────────────── */}
        <div
          className="card animate-fade-up"
          style={{ padding: "16px", marginBottom: 20, display: "flex", gap: 0 }}
        >
          <div style={{ flex: 1, textAlign: "center", borderRight: "1px solid var(--border-light)" }}>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 4 }}>Income</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "var(--green)", fontFamily: "'JetBrains Mono', monospace" }}>
              +{formatCurrency(totalIncome)}
            </p>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 4 }}>Expenses</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "var(--red)", fontFamily: "'JetBrains Mono', monospace" }}>
              -{formatCurrency(totalExpense)}
            </p>
          </div>
        </div>

        {/* ── Period Filter ───────────────────────────── */}
        <div
          className="animate-fade-up delay-100"
          style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 12, paddingBottom: 4 }}
        >
          {DATE_FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-chip ${activePeriod === f ? "active" : ""}`}
              id={`tx-period-${f.toLowerCase().replace(" ", "-")}`}
              onClick={() => setActivePeriod(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Type Filter ─────────────────────────────── */}
        <div className="tab-bar animate-fade-up delay-150" style={{ marginBottom: 20 }}>
          {FILTER_TABS.map((t) => (
            <button
              key={t}
              className={`tab-item ${activeType === t ? "active" : ""}`}
              id={`tx-type-${t.toLowerCase()}`}
              onClick={() => setActiveType(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Grouped Transactions ────────────────────── */}
        <div className="animate-fade-up delay-200">
          {Object.entries(grouped).map(([date, txs]) => (
            <div key={date} style={{ marginBottom: 8 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {date}
              </p>
              <div className="card" style={{ padding: "4px 16px" }}>
                {txs.map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
