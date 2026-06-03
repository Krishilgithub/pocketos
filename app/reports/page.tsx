"use client";

import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import { IncomeExpenseChart, DonutChart } from "@/components/charts/Charts";
import { ANALYTICS_DATA, formatCurrency, getMonthlyIncome, getMonthlyExpense, MOCK_TRANSACTIONS } from "@/lib/utils";
import { Download, Share2 } from "lucide-react";

const CATEGORY_SPEND = [
  { label: "Food & Mess", value: 3800, color: "#F97316" },
  { label: "Groceries", value: 2100, color: "#EAB308" },
  { label: "Entertainment", value: 1380, color: "#EC4899" },
  { label: "Travel", value: 1200, color: "#22C55E" },
  { label: "Utilities", value: 2549, color: "#14B8A6" },
  { label: "Other", value: 1580, color: "#6B7280" },
];

const STAT_CARDS = [
  { label: "Income", value: formatCurrency(45000), sub: "June 2025", color: "var(--green)" },
  { label: "Expenses", value: formatCurrency(28000), sub: "June 2025", color: "var(--red)" },
  { label: "Savings Rate", value: "37.8%", sub: "This month", color: "var(--blue)" },
  { label: "Net Worth", value: formatCurrency(49300), sub: "Total assets", color: "var(--purple)" },
];

export default function ReportsPage() {
  return (
    <div className="page-container" id="reports-page">
      <PageHeader
        title="Reports & Analytics"
        rightAction={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="header-icon-btn" aria-label="Share report" id="reports-share-btn">
              <Share2 size={16} color="var(--text-primary)" strokeWidth={1.8} />
            </button>
            <button className="header-icon-btn" aria-label="Download report" id="reports-download-btn">
              <Download size={16} color="var(--text-primary)" strokeWidth={1.8} />
            </button>
          </div>
        }
      />

      <div style={{ padding: "0 20px" }}>
        {/* ── Period Selector ────────────────────────── */}
        <div className="tab-bar animate-fade-up" style={{ marginBottom: 24 }}>
          {["Month", "Quarter", "Year"].map((period, idx) => (
            <button
              key={period}
              className={`tab-item ${idx === 0 ? "active" : ""}`}
              id={`reports-period-${period.toLowerCase()}`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* ── 4 KPI Cards ────────────────────────────── */}
        <div
          className="animate-fade-up delay-100"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {STAT_CARDS.map((stat, idx) => (
            <div
              key={stat.label}
              className="card"
              id={`reports-stat-${stat.label.toLowerCase().replace(" ", "-")}`}
              style={{ padding: "14px 16px" }}
            >
              <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 6 }}>
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: stat.color,
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 2,
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Income vs Expense Chart ─────────────────── */}
        <div
          className="card animate-fade-up delay-150"
          style={{ padding: "18px", marginBottom: 16 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
              Income vs Expenses
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>Income</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)" }} />
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>Expense</span>
              </div>
            </div>
          </div>
          <IncomeExpenseChart
            incomeData={ANALYTICS_DATA.monthlyIncome}
            expenseData={ANALYTICS_DATA.monthlyExpense}
            labels={ANALYTICS_DATA.months}
            height={150}
          />
        </div>

        {/* ── Category Breakdown ──────────────────────── */}
        <div
          className="card animate-fade-up delay-200"
          style={{ padding: "18px", marginBottom: 16 }}
        >
          <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
            Spending by Category
          </p>
          <DonutChart data={CATEGORY_SPEND} size={120} />
        </div>

        {/* ── Savings Rate Card ───────────────────────── */}
        <div
          className="card-dark animate-fade-up delay-250"
          style={{ padding: "20px", marginBottom: 16 }}
        >
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
            Savings Rate — June 2025
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
            <span
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: "var(--green)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              37.8%
            </span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>of income saved</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "37.8%", background: "var(--green)", borderRadius: 99 }} />
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
            🎯 Goal: ≥ 20% · You're exceeding your savings goal!
          </p>
        </div>

        {/* ── Export Buttons ──────────────────────────── */}
        <div className="animate-fade-up delay-300" style={{ display: "flex", gap: 12 }}>
          <button
            id="reports-export-csv"
            style={{
              flex: 1,
              height: 48,
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            id="reports-export-pdf"
            style={{
              flex: 1,
              height: 48,
              border: "none",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-dark)",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Share2 size={15} />
            Share PDF
          </button>
        </div>
      </div>

      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
