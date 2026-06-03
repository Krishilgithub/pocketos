import Link from "next/link";
import { Bell, Settings, TrendingUp, TrendingDown } from "lucide-react";
import { redirect } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import GoalCard from "@/components/ui/GoalCard";
import TransactionItem from "@/components/ui/TransactionItem";
import { getUser, getProfile } from "@/lib/actions/auth";
import { getTransactions, getMonthlyStats } from "@/lib/actions/transactions";
import { getAccounts, getTotalBalance } from "@/lib/actions/accounts";
import { getSavingsGoals } from "@/lib/actions/savings";
import { getBills } from "@/lib/actions/bills";
import { formatCurrency, formatCurrencyFull, getDaysRemaining } from "@/lib/utils";
import { Account } from "@/lib/database.types";

// Helper to map DB data to GoalCard-compatible format
function mapGoal(goal: any) {
  const now = new Date();
  const target = new Date(goal.target_date);
  const daysLeft = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const pct = Math.min(100, Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100));
  const monthlyNeeded = daysLeft > 0 ? Number(goal.target_amount - goal.current_amount) / (daysLeft / 30) : 0;
  const status = pct >= 100 ? "completed"
    : (goal.monthly_contribution && monthlyNeeded > goal.monthly_contribution * 1.2) ? "falling_behind"
    : "on_track";

  return {
    id: goal.id,
    name: goal.name,
    icon: goal.icon,
    targetAmount: Number(goal.target_amount),
    currentAmount: Number(goal.current_amount),
    targetDate: new Date(goal.target_date),
    monthlyContribution: Number(goal.monthly_contribution),
    color: goal.color,
    status,
  };
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const profile = await getProfile();

  // Parallel data fetching
  const [accounts, goals, transactions, bills, stats] = await Promise.all([
    getAccounts(),
    getSavingsGoals(),
    getTransactions({ limit: 4 }),
    getBills(),
    getMonthlyStats(),
  ]);

  const totalBalance = accounts.reduce((sum: number, acc: Account) => sum + Number(acc.balance), 0);
  const primaryAccount = accounts.find((a: Account) => a.is_default) || accounts[0];
  const savingsRate = stats.income > 0 ? Math.round((stats.net / stats.income) * 100) : 0;
  const upcomingBills = bills.filter((b: any) => b.status !== "paid").slice(0, 3);
  const topGoals = goals.slice(0, 3).map(mapGoal);

  const displayName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

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
            {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Welcome, {displayName}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/settings" className="header-icon-btn" id="dashboard-settings-btn" aria-label="Settings">
            <Settings size={18} color="var(--text-secondary)" strokeWidth={1.8} />
          </Link>
          <Link href="/notifications" className="header-icon-btn" id="dashboard-bell-btn" aria-label="Notifications">
            <Bell size={18} color="var(--text-secondary)" strokeWidth={1.8} />
          </Link>
        </div>
      </div>

      {/* ── Balance Card (Dark) ───────────────────────────── */}
      <div style={{ padding: "0 20px 24px" }}>
        <div className="card-dark animate-fade-up delay-100" id="balance-card" style={{ padding: "24px 22px" }}>
          {/* Masked card number */}
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
              <div style={{ width: 18, height: 12, background: "var(--green)", borderRadius: 3 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>
                {primaryAccount?.last_four ? `•••• ${primaryAccount.last_four}` : "•••• ••••"}
              </span>
            </div>
          </div>

          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500, marginBottom: 6 }}>My Balance</p>
          <p
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: "white",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            {formatCurrencyFull(totalBalance)}
          </p>

          {/* Monthly stats */}
          <div style={{ display: "flex", gap: 16, marginBottom: 24, padding: "12px 14px", background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)" }}>
            <div style={{ flex: 1, borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                <TrendingUp size={12} color="var(--green)" />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Income</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--green)", fontFamily: "'JetBrains Mono', monospace" }}>
                {formatCurrency(stats.income)}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                <TrendingDown size={12} color="var(--red)" />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Expenses</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--red)", fontFamily: "'JetBrains Mono', monospace" }}>
                {formatCurrency(stats.expense)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {[
              { icon: "＋", label: "Top up", href: "/add" },
              { icon: "↗", label: "Send", href: "/contacts" },
              { icon: "↙", label: "Withdraw", href: "/accounts" },
              { icon: "≡", label: "History", href: "/transactions" },
            ].map(({ icon, label, href }) => (
              <Link key={label} href={href} className="action-btn" id={`dashboard-action-${label.toLowerCase()}`} style={{ textDecoration: "none" }}>
                <div className="action-btn-circle">
                  <span style={{ fontSize: 20, color: "white", lineHeight: 1 }}>{icon}</span>
                </div>
                <span className="action-btn-label">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Stats ────────────────────────────────────── */}
      <div className="animate-fade-up delay-150" style={{ padding: "0 20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="card" style={{ padding: "14px 16px" }}>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 6 }}>Savings Rate</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: savingsRate >= 20 ? "var(--green)" : "var(--orange)", fontFamily: "'JetBrains Mono', monospace" }}>
            {savingsRate}%
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Goal: ≥ 20%</p>
        </div>
        <div className="card" style={{ padding: "14px 16px" }}>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 6 }}>Net This Month</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: stats.net >= 0 ? "var(--green)" : "var(--red)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.01em" }}>
            {stats.net >= 0 ? "+" : "-"}{formatCurrency(Math.abs(stats.net))}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Income − Expenses</p>
        </div>
      </div>

      {/* ── Bills Due Soon ─────────────────────────────────── */}
      {upcomingBills.length > 0 && (
        <div className="animate-fade-up delay-200">
          <div className="section-header">
            <h2 className="section-title">Bills due soon</h2>
            <Link href="/bills" className="section-link" id="dashboard-bills-viewall">View all ›</Link>
          </div>
          <div style={{ padding: "0 20px", display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {upcomingBills.map((bill: any) => {
              const days = getDaysRemaining(new Date(bill.next_due_at));
              const isOverdue = bill.status === "overdue";
              const isDueSoon = bill.status === "due_soon";
              return (
                <Link
                  key={bill.id}
                  href="/bills"
                  className="card"
                  style={{ padding: "14px", minWidth: 130, flexShrink: 0, borderLeft: `3px solid ${isOverdue ? "var(--red)" : isDueSoon ? "var(--orange)" : "var(--border)"}`, textDecoration: "none" }}
                  id={`dash-bill-${bill.id}`}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{bill.icon}</div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{bill.name}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-primary)", marginBottom: 4 }}>
                    {formatCurrency(Number(bill.amount))}
                  </p>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: "var(--radius-full)", background: isOverdue ? "var(--red-light)" : isDueSoon ? "var(--orange-light)" : "var(--bg-input)", color: isOverdue ? "var(--red)" : isDueSoon ? "var(--orange)" : "var(--text-secondary)" }}>
                    {isOverdue ? "Overdue" : days === 0 ? "Due today" : `${days}d left`}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Savings Goals ──────────────────────────────────── */}
      {topGoals.length > 0 ? (
        <div className="animate-fade-up delay-250" style={{ marginTop: 24 }}>
          <div className="section-header">
            <h2 className="section-title">Your goals</h2>
            <Link href="/savings" className="section-link" id="dashboard-goals-viewall">View all ›</Link>
          </div>
          <div style={{ padding: "0 20px" }}>
            {topGoals.map((goal: any, idx: number) => (
              <GoalCard key={goal.id} goal={goal} index={idx} />
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fade-up delay-250" style={{ margin: "24px 20px" }}>
          <div className="section-header">
            <h2 className="section-title">Your goals</h2>
          </div>
          <div className="card" style={{ padding: "24px", textAlign: "center" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🎯</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>No goals yet</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>Set a savings goal and start tracking!</p>
            <Link href="/savings" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", width: "auto", padding: "0 24px" }}>
              Create a goal
            </Link>
          </div>
        </div>
      )}

      {/* ── Recent Transactions ─────────────────────────────── */}
      <div className="animate-fade-up delay-300" style={{ marginTop: 8 }}>
        <div className="section-header">
          <h2 className="section-title">Recent activity</h2>
          <Link href="/transactions" className="section-link" id="dashboard-tx-viewall">View all ›</Link>
        </div>
        {transactions.length > 0 ? (
          <div className="card" style={{ margin: "0 20px", padding: "4px 16px" }}>
            {transactions.map((tx: any) => (
              <TransactionItem key={tx.id} transaction={tx} category={tx.category} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ margin: "0 20px", padding: "24px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>No transactions yet. Add your first one!</p>
          </div>
        )}
      </div>

      <div style={{ height: 32 }} />
      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
