import { redirect } from "next/navigation";
import { Plus, AlertCircle, Clock } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import BillCard from "@/components/ui/BillCard";
import { getUser } from "@/lib/actions/auth";
import { getBills } from "@/lib/actions/bills";
import { formatCurrency } from "@/lib/utils";

export default async function BillsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const bills = await getBills();

  const overdueBills = bills.filter((b: any) => b.status === "overdue");
  const dueSoonBills = bills.filter((b: any) => b.status === "due_soon");
  const upcomingBills = bills.filter((b: any) => b.status === "upcoming");
  
  const totalDue = bills.reduce((sum: number, b: any) => sum + Number(b.amount), 0);

  return (
    <div className="page-container" id="bills-page">
      <PageHeader
        title="Bills & Reminders"
        rightAction={
          <button className="header-icon-btn" aria-label="Add bill" id="bills-add-btn">
            <Plus size={18} color="var(--text-primary)" strokeWidth={2.5} />
          </button>
        }
      />

      <div style={{ padding: "0 20px 24px" }}>
        {/* ── Summary ────────────────────────────────── */}
        <div
          className="card-dark animate-fade-up"
          style={{ padding: "20px", marginBottom: 24 }}
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>Total Due</p>
          <p
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "white",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 14,
            }}
          >
            {formatCurrency(totalDue)}
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {overdueBills.length > 0 && (
              <div
                style={{
                  flex: 1,
                  background: "rgba(239,68,68,0.15)",
                  borderRadius: "var(--radius-md)",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <AlertCircle size={14} color="var(--red)" />
                <span style={{ fontSize: 12, color: "var(--red)", fontWeight: 600 }}>
                  {overdueBills.length} Overdue
                </span>
              </div>
            )}
            <div
              style={{
                flex: 1,
                background: "rgba(249,115,22,0.15)",
                borderRadius: "var(--radius-md)",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Clock size={14} color="var(--orange)" />
              <span style={{ fontSize: 12, color: "var(--orange)", fontWeight: 600 }}>
                {dueSoonBills.length} Due Soon
              </span>
            </div>
          </div>
        </div>

        {/* ── Overdue ──────────────────────────────── */}
        {overdueBills.length > 0 && (
          <div className="animate-fade-up delay-100" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--red)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Overdue
            </p>
            {overdueBills.map((bill: any) => <BillCard key={bill.id} bill={bill} />)}
          </div>
        )}

        {/* ── Due Soon ─────────────────────────────── */}
        {dueSoonBills.length > 0 && (
          <div className="animate-fade-up delay-150" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--orange)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Due Soon
            </p>
            {dueSoonBills.map((bill: any) => <BillCard key={bill.id} bill={bill} />)}
          </div>
        )}

        {/* ── Upcoming ─────────────────────────────── */}
        {upcomingBills.length > 0 && (
          <div className="animate-fade-up delay-200">
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Upcoming
            </p>
            {upcomingBills.map((bill: any) => <BillCard key={bill.id} bill={bill} />)}
          </div>
        )}

        {bills.length === 0 && (
          <div className="card animate-fade-up delay-100" style={{ padding: "40px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📄</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>No bills</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Add a bill to keep track of due dates</p>
          </div>
        )}
      </div>

      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
