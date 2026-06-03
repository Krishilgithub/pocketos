import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MoreHorizontal, Target, Calendar, CheckCircle, Plus } from "lucide-react";
import { getUser } from "@/lib/actions/auth";
import { getSavingsGoalById } from "@/lib/actions/savings";
import { formatCurrency, formatCurrencyFull, getDaysRemaining } from "@/lib/utils";

export default async function GoalDetailPage({ params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const goalData = await getSavingsGoalById(params.id);
  if (!goalData) redirect("/savings");

  const { goal, transactions } = goalData;
  const currentAmount = Number(goal.current_amount);
  const targetAmount = Number(goal.target_amount);
  const monthlyContribution = Number(goal.monthly_contribution);
  
  const pct = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
  const remaining = Math.max(0, targetAmount - currentAmount);
  
  const targetDate = new Date(goal.target_date);
  const daysLeft = Math.max(0, getDaysRemaining(targetDate));
  
  const monthsLeft = daysLeft / 30;
  const neededMonthly = monthsLeft > 0 ? remaining / monthsLeft : 0;
  
  const isOnTrack = pct >= 100 || (monthlyContribution > 0 && neededMonthly <= monthlyContribution * 1.1);

  return (
    <div
      id="goal-detail-page"
      style={{
        minHeight: "100dvh",
        background: "var(--bg-app)",
        display: "flex",
        flexDirection: "column",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <div
        style={{
          padding: "20px 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/savings" className="header-icon-btn">
          <ChevronLeft size={22} color="var(--text-primary)" strokeWidth={2.5} />
        </Link>
        <button className="header-icon-btn">
          <MoreHorizontal size={22} color="var(--text-primary)" />
        </button>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {/* ── Goal Title ──────────────────────────────── */}
        <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div
            className="icon-circle"
            style={{ width: 56, height: 56, background: goal.color + "18", fontSize: 28 }}
          >
            {goal.icon}
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: 4 }}>
              {goal.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: isOnTrack ? "var(--green)" : "var(--orange)"
                }}
              />
              <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                {pct >= 100 ? "Completed" : isOnTrack ? "On track" : "Falling behind"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Progress Card (Dark) ────────────────────── */}
        <div className="card-dark animate-fade-up delay-100" style={{ padding: "24px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500, marginBottom: 4 }}>
                Saved so far
              </p>
              <p
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "white",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {formatCurrencyFull(currentAmount)}
              </p>
            </div>
            <div
              style={{
                padding: "4px 10px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "var(--radius-full)",
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {pct}%
            </div>
          </div>

          <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
            <div
              style={{
                height: "100%", width: `${pct}%`, background: goal.color, borderRadius: 99, transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>0</span>
            <span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>{formatCurrency(targetAmount)}</span>
          </div>
        </div>

        {/* ── Stats ───────────────────────────────────── */}
        <div className="animate-fade-up delay-150" style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <div className="card" style={{ flex: 1, padding: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Calendar size={14} color="var(--blue)" />
              <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>Target Date</span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              {targetDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{daysLeft} days left</p>
          </div>
          <div className="card" style={{ flex: 1, padding: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Target size={14} color="var(--purple)" />
              <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>Monthly Target</span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-primary)" }}>
              {formatCurrency(neededMonthly)}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>to reach goal</p>
          </div>
        </div>

        {/* ── Contributions ────────────────────────────── */}
        <div className="animate-fade-up delay-200">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Recent Contributions</h2>
          {transactions.length > 0 ? (
            <div className="card" style={{ padding: "4px 16px" }}>
              {transactions.map((tx: any, idx: number) => (
                <div
                  key={tx.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 0", borderBottom: idx < transactions.length - 1 ? "1px solid var(--border-light)" : "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: "var(--green-light)", color: "var(--green)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Plus size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>Top up</p>
                      <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                        {new Date(tx.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--green)" }}>
                    +{formatCurrency(Number(tx.amount))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: "24px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>No contributions yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Fixed Bottom Actions ─────────────────────── */}
      <div
        className="animate-fade-up delay-300"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
          background: "rgba(247,248,250,0.9)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--border)",
          display: "flex", gap: 12
        }}
      >
        <button
          className="btn-secondary"
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          Withdraw
        </button>
        <button
          className="btn-primary"
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          Top up <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
