"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { formatCurrency, getDaysRemaining } from "@/lib/utils";
import { markBillPaid } from "@/lib/actions/bills";

export default function BillCard({ bill }: { bill: any }) {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const daysLeft = getDaysRemaining(new Date(bill.next_due_at));
  const isOverdue = bill.status === "overdue" && !paid;
  const isDueSoon = bill.status === "due_soon" && !paid;

  const handlePay = async () => {
    setLoading(true);
    await markBillPaid(bill.id);
    setPaid(true);
    setLoading(false);
  };

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
              · {new Date(bill.next_due_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
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
            {formatCurrency(Number(bill.amount))}
          </p>
          {!paid && (
            <button
              onClick={handlePay}
              disabled={loading}
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
                cursor: loading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : null}
              Pay
            </button>
          )}
          {paid && <CheckCircle size={20} color="var(--green)" />}
        </div>
      </div>
    </div>
  );
}
