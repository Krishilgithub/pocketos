"use client";

import { useState } from "react";
import { CheckCircle, Plus, AlertCircle, Clock } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import { MOCK_BILLS, formatCurrency, getDaysRemaining } from "@/lib/utils";
import { Bill } from "@/lib/types";

function BillCard({ bill }: { bill: Bill }) {
  const [paid, setPaid] = useState(false);
  const daysLeft = getDaysRemaining(bill.dueDate);
  const isOverdue = bill.status === "overdue" && !paid;
  const isDueSoon = bill.status === "due_soon" && !paid;

  return (
    <div
      className="card"
      id={`bill-${bill.id}`}
      style={{
        padding: "16px",
        marginBottom: 12,
        borderLeft: `3px solid ${paid ? "var(--green)" : isOverdue ? "var(--red)" : isDueSoon ? "var(--orange)" : "var(--border)"}`,
        opacity: paid ? 0.6 : 1,
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Icon */}
        <div
          className="icon-circle"
          style={{
            width: 44,
            height: 44,
            background: paid ? "var(--green-light)" : isOverdue ? "var(--red-light)" : "var(--bg-input)",
            fontSize: 20,
          }}
        >
          {bill.icon}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 3,
              textDecoration: paid ? "line-through" : "none",
            }}
          >
            {bill.name}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {paid ? (
              <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 500 }}>✓ Paid</span>
            ) : isOverdue ? (
              <span style={{ fontSize: 12, color: "var(--red)", fontWeight: 500 }}>
                Overdue by {Math.abs(daysLeft)} days
              </span>
            ) : (
              <span style={{ fontSize: 12, color: isDueSoon ? "var(--orange)" : "var(--text-secondary)" }}>
                {daysLeft === 0 ? "Due today" : `Due in ${daysLeft} days`}
              </span>
            )}
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              · {bill.dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </div>
        </div>

        {/* Amount + Mark Paid */}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--text-primary)",
              marginBottom: 6,
            }}
          >
            {formatCurrency(bill.amount)}
          </p>
          {!paid && (
            <button
              onClick={() => setPaid(true)}
              id={`bill-pay-${bill.id}`}
              style={{
                padding: "4px 12px",
                background: "var(--bg-dark)",
                color: "white",
                borderRadius: "var(--radius-full)",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
              }}
            >
              Pay
            </button>
          )}
          {paid && <CheckCircle size={20} color="var(--green)" />}
        </div>
      </div>
    </div>
  );
}

export default function BillsPage() {
  const overdueBills = MOCK_BILLS.filter((b) => b.status === "overdue");
  const dueSoonBills = MOCK_BILLS.filter((b) => b.status === "due_soon");
  const upcomingBills = MOCK_BILLS.filter((b) => b.status === "upcoming");
  const totalDue = MOCK_BILLS.reduce((sum, b) => sum + b.amount, 0);

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

      <div style={{ padding: "0 20px" }}>
        {/* ── Summary ────────────────────────────────── */}
        <div
          className="card-dark animate-fade-up"
          style={{ padding: "20px", marginBottom: 24 }}
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>Due This Month</p>
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
            {overdueBills.map((bill) => <BillCard key={bill.id} bill={bill} />)}
          </div>
        )}

        {/* ── Due Soon ─────────────────────────────── */}
        {dueSoonBills.length > 0 && (
          <div className="animate-fade-up delay-150" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--orange)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Due Soon
            </p>
            {dueSoonBills.map((bill) => <BillCard key={bill.id} bill={bill} />)}
          </div>
        )}

        {/* ── Upcoming ─────────────────────────────── */}
        <div className="animate-fade-up delay-200">
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Upcoming
          </p>
          {upcomingBills.map((bill) => <BillCard key={bill.id} bill={bill} />)}
        </div>
      </div>

      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
