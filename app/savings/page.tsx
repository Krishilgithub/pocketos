import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getUser } from "@/lib/actions/auth";
import { getSavingsGoals } from "@/lib/actions/savings";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import GoalCard from "@/components/ui/GoalCard";
import FAB from "@/components/layout/FAB";
import { formatCurrency } from "@/lib/utils";

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

export default async function SavingsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const rawGoals = await getSavingsGoals();
  const goals = rawGoals.map(mapGoal);

  const totalSaved = rawGoals.reduce((sum: number, g: any) => sum + Number(g.current_amount), 0);
  const totalTarget = rawGoals.reduce((sum: number, g: any) => sum + Number(g.target_amount), 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="page-container" id="savings-page">
      <PageHeader
        title="Savings Goals"
        rightAction={
          <Link href="/savings/new" className="header-icon-btn" aria-label="New goal" id="savings-new-goal-btn">
            <Plus size={18} color="var(--text-primary)" strokeWidth={2.5} />
          </Link>
        }
      />

      <div style={{ padding: "0 20px 24px" }}>
        {/* Total Saved Card */}
        <div className="card-dark animate-fade-up" style={{ padding: "22px", marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500, marginBottom: 6 }}>Total Saved</p>
          <p style={{ fontSize: 34, fontWeight: 800, color: "white", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em", marginBottom: 16 }}>
            {formatCurrency(totalSaved)}
          </p>
          <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${overallPct}%`, background: "var(--green)", borderRadius: 99, transition: "width 0.8s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              {overallPct}% of {formatCurrency(totalTarget)} total goal
            </span>
            <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>
              {goals.filter((g: any) => g.status === "on_track").length} on track
            </span>
          </div>
        </div>

        {/* Goals */}
        <div className="animate-fade-up delay-100">
          {goals.length > 0 ? (
            goals.map((goal: any, idx: number) => (
              <GoalCard key={goal.id} goal={goal} index={idx} />
            ))
          ) : (
            <div className="card" style={{ padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🎯</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>No savings goals yet</p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
                Create your first goal and start saving!
              </p>
              <Link href="/savings/new" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", width: "auto", padding: "0 24px" }}>
                + Create a goal
              </Link>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
