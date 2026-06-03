import { redirect } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import { IncomeExpenseChart, DonutChart } from "@/components/charts/Charts";
import { formatCurrency } from "@/lib/utils";
import { Download, Share2 } from "lucide-react";
import { getUser } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ReportsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const supabase = await createClient();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Get start of year
  const startOfYear = new Date(currentYear, 0, 1).toISOString();

  // Fetch this year's transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type, date, category:categories(name, color)")
    .eq("user_id", user.id)
    .gte("date", startOfYear);

  // Group by month
  const monthlyIncome = new Array(12).fill(0);
  const monthlyExpense = new Array(12).fill(0);
  
  // Category breakdown for current month
  const categorySpend: Record<string, { label: string; value: number; color: string }> = {};
  
  let currentMonthIncome = 0;
  let currentMonthExpense = 0;

  (transactions || []).forEach((tx: any) => {
    const txDate = new Date(tx.date);
    const monthIdx = txDate.getMonth();
    const amount = Number(tx.amount);

    if (tx.type === "income") {
      monthlyIncome[monthIdx] += amount;
      if (monthIdx === currentMonth - 1) currentMonthIncome += amount;
    } else if (tx.type === "expense") {
      monthlyExpense[monthIdx] += amount;
      if (monthIdx === currentMonth - 1) {
        currentMonthExpense += amount;
        
        // Category spend
        const catName = tx.category?.name || "Uncategorized";
        if (!categorySpend[catName]) {
          categorySpend[catName] = { label: catName, value: 0, color: tx.category?.color || "#6B7280" };
        }
        categorySpend[catName].value += amount;
      }
    }
  });

  // Calculate Net Worth
  const { data: accounts } = await supabase
    .from("accounts")
    .select("balance")
    .eq("user_id", user.id);
  const netWorth = (accounts || []).reduce((sum, acc: any) => sum + Number(acc.balance), 0);

  const savingsRate = currentMonthIncome > 0 
    ? Math.round(((currentMonthIncome - currentMonthExpense) / currentMonthIncome) * 100) 
    : 0;

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthName = monthLabels[currentMonth - 1];

  const statCards = [
    { label: "Income", value: formatCurrency(currentMonthIncome), sub: `${currentMonthName} ${currentYear}`, color: "var(--green)" },
    { label: "Expenses", value: formatCurrency(currentMonthExpense), sub: `${currentMonthName} ${currentYear}`, color: "var(--red)" },
    { label: "Savings Rate", value: `${savingsRate}%`, sub: "This month", color: "var(--blue)" },
    { label: "Net Worth", value: formatCurrency(netWorth), sub: "Total assets", color: "var(--purple)" },
  ];

  const categorySpendArray = Object.values(categorySpend).sort((a, b) => b.value - a.value);

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

      <div style={{ padding: "0 20px 24px" }}>
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
          {statCards.map((stat, idx) => (
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
            incomeData={monthlyIncome}
            expenseData={monthlyExpense}
            labels={monthLabels}
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
          {categorySpendArray.length > 0 ? (
            <DonutChart data={categorySpendArray} size={120} />
          ) : (
            <p style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "center", padding: "20px 0" }}>
              No expenses this month
            </p>
          )}
        </div>

        {/* ── Savings Rate Card ───────────────────────── */}
        <div
          className="card-dark animate-fade-up delay-250"
          style={{ padding: "20px", marginBottom: 16 }}
        >
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
            Savings Rate — {currentMonthName} {currentYear}
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
            <span
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: savingsRate >= 20 ? "var(--green)" : "var(--orange)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {savingsRate}%
            </span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>of income saved</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, savingsRate))}%`, background: savingsRate >= 20 ? "var(--green)" : "var(--orange)", borderRadius: 99 }} />
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
            🎯 Goal: ≥ 20% · {savingsRate >= 20 ? "You're exceeding your savings goal!" : "You're falling slightly short this month."}
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
