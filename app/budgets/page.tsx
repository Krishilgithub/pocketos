"use client";

import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  MOCK_BUDGETS,
  MOCK_CATEGORIES,
  formatCurrency,
  getProgress,
  getProgressColor,
} from "@/lib/utils";

export default function BudgetsPage() {
  const totalSpent = MOCK_BUDGETS.reduce((s, b) => s + b.spentAmount, 0);
  const totalLimit = MOCK_BUDGETS.reduce((s, b) => s + b.limitAmount, 0);
  const overallPct = getProgress(totalSpent, totalLimit);

  return (
    <div className="page-container" id="budgets-page">
      <PageHeader title="Budget Planner" />

      <div style={{ padding: "0 20px" }}>
        {/* ── Month Selector ─────────────────────────── */}
        <div
          className="animate-fade-up"
          style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "8px 20px",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <span style={{ fontSize: 16, cursor: "pointer", color: "var(--text-secondary)" }}>‹</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>June 2025</span>
            <span style={{ fontSize: 16, cursor: "pointer", color: "var(--text-secondary)" }}>›</span>
          </div>
        </div>

        {/* ── Overview Card ──────────────────────────── */}
        <div
          className="card-dark animate-fade-up delay-50"
          style={{ padding: "22px", marginBottom: 24 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Total Spent</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: "white", fontFamily: "'JetBrains Mono', monospace" }}>
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Budget</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontFamily: "'JetBrains Mono', monospace" }}>
                {formatCurrency(totalLimit)}
              </p>
            </div>
          </div>

          {/* Overall progress */}
          <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
            <div
              style={{
                height: "100%",
                width: `${overallPct}%`,
                background: overallPct >= 90 ? "var(--red)" : overallPct >= 60 ? "var(--orange)" : "var(--green)",
                borderRadius: 99,
                transition: "width 0.8s ease",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              {overallPct}% used
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
              {formatCurrency(totalLimit - totalSpent)} remaining
            </span>
          </div>
        </div>

        {/* ── Per-Category Budgets ────────────────────── */}
        <div className="animate-fade-up delay-150">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>By Category</h2>

          {MOCK_BUDGETS.map((budget, idx) => {
            const category = MOCK_CATEGORIES.find((c) => c.id === budget.categoryId);
            const pct = getProgress(budget.spentAmount, budget.limitAmount);
            const barColor = getProgressColor(pct);
            const remaining = budget.limitAmount - budget.spentAmount;

            return (
              <div
                key={budget.id}
                className="card"
                id={`budget-${budget.id}`}
                style={{
                  padding: "16px",
                  marginBottom: 12,
                  opacity: 0,
                  animation: `fadeInUp 0.4s ease forwards`,
                  animationDelay: `${idx * 60}ms`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {/* Category Icon */}
                  <div
                    className="icon-circle"
                    style={{
                      width: 40,
                      height: 40,
                      background: category?.bgColor || "var(--bg-input)",
                      fontSize: 18,
                    }}
                  >
                    {category?.icon || "📦"}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                      {category?.name || "Unknown"}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.limitAmount)}
                    </p>
                  </div>

                  {/* Percentage badge */}
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      background: pct >= 90 ? "var(--red-light)" : pct >= 60 ? "var(--orange-light)" : "var(--green-light)",
                      color: barColor,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {pct}%
                  </div>
                </div>

                {/* Progress bar */}
                <ProgressBar current={budget.spentAmount} target={budget.limitAmount} color={barColor} height={6} />

                {pct >= 90 && (
                  <p style={{ fontSize: 11, color: "var(--red)", marginTop: 8, fontWeight: 500 }}>
                    ⚠ Only {formatCurrency(remaining)} remaining
                  </p>
                )}
                {remaining < 0 && (
                  <p style={{ fontSize: 11, color: "var(--red)", marginTop: 8, fontWeight: 500 }}>
                    🔴 Exceeded by {formatCurrency(Math.abs(remaining))}
                  </p>
                )}
              </div>
            );
          })}

          {/* Add Budget Button */}
          <button
            id="budgets-add-btn"
            style={{
              width: "100%",
              height: 52,
              border: "2px dashed var(--border)",
              borderRadius: "var(--radius-xl)",
              background: "transparent",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-secondary)",
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            + Add Budget Category
          </button>
        </div>
      </div>

      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
