import { redirect } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import ProgressBar from "@/components/ui/ProgressBar";
import { getUser } from "@/lib/actions/auth";
import { getBudgets } from "@/lib/actions/budgets";
import { formatCurrency, getProgressColor } from "@/lib/utils";

export default async function BudgetsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const budgets = await getBudgets();

  const totalSpent = budgets.reduce((s: number, b: any) => s + Number(b.spent_amount), 0);
  const totalLimit = budgets.reduce((s: number, b: any) => s + Number(b.limit_amount), 0);
  const overallPct = totalLimit > 0 ? Math.min(100, Math.round((totalSpent / totalLimit) * 100)) : 0;

  return (
    <div className="page-container" id="budgets-page">
      <PageHeader title="Budget Planner" />

      <div style={{ padding: "0 20px 24px" }}>
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
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
              {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
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
              {formatCurrency(Math.max(0, totalLimit - totalSpent))} remaining
            </span>
          </div>
        </div>

        {/* ── Per-Category Budgets ────────────────────── */}
        <div className="animate-fade-up delay-150">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>By Category</h2>

          {budgets.length > 0 ? budgets.map((budget: any, idx: number) => {
            const pct = budget.progress_percent;
            const barColor = getProgressColor(pct);
            const remaining = Number(budget.limit_amount) - Number(budget.spent_amount);

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
                  <div
                    className="icon-circle"
                    style={{
                      width: 40,
                      height: 40,
                      background: budget.category?.bg_color || "var(--bg-input)",
                      fontSize: 18,
                    }}
                  >
                    {budget.category?.icon || "📦"}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                      {budget.category?.name || "Unknown"}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {formatCurrency(Number(budget.spent_amount))} / {formatCurrency(Number(budget.limit_amount))}
                    </p>
                  </div>

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

                <ProgressBar current={Number(budget.spent_amount)} target={Number(budget.limit_amount)} color={barColor} height={6} />

                {pct >= 90 && remaining >= 0 && (
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
          }) : (
            <div className="card" style={{ padding: "40px 24px", textAlign: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>📊</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>No budgets set</p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Create a budget to track category limits</p>
            </div>
          )}

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
