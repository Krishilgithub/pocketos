"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MoreVertical, Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import BarChart from "@/components/charts/Charts";
import {
  MOCK_GOALS,
  MOCK_TRANSACTIONS,
  ANALYTICS_DATA,
  formatCurrency,
  formatCurrencyFull,
  getDaysRemaining,
  getProgress,
} from "@/lib/utils";

interface GoalDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = use(params);
  const goal = MOCK_GOALS.find((g) => g.id === id) || MOCK_GOALS[0];
  const daysLeft = getDaysRemaining(goal.targetDate);
  const percentage = getProgress(goal.currentAmount, goal.targetAmount);
  const remaining = goal.targetAmount - goal.currentAmount;

  // Simulated monthly savings data for this goal
  const monthlyData = ANALYTICS_DATA.savingsHistory;

  // Simulated goal transactions
  const goalTransactions = [
    { id: "gt-1", label: "Goal top up", sub: goal.name, amount: 2500, time: "12:00 PM", positive: true },
    { id: "gt-2", label: "Goal top up", sub: goal.name, amount: 2500, time: "01 May", positive: true },
    { id: "gt-3", label: "Milestone bonus", sub: "25% reached!", amount: 0, time: "15 Apr", positive: true },
    { id: "gt-4", label: "Goal top up", sub: goal.name, amount: 5000, time: "01 Apr", positive: true },
  ];

  return (
    <div
      id="goal-detail-page"
      style={{
        minHeight: "100dvh",
        background: "var(--bg-app)",
        paddingBottom: 100,
      }}
    >
      <PageHeader
        title="Goals Detail"
        showBack
        backHref="/savings"
        showMore
      />

      <div style={{ padding: "0 20px" }}>
        {/* ── Goal Hero ──────────────────────────────────── */}
        <div className="animate-fade-up" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div
              className="icon-circle"
              style={{
                width: 56,
                height: 56,
                background: goal.color + "20",
                fontSize: 26,
              }}
            >
              {goal.icon}
            </div>
            {/* Progress badge */}
            <div
              style={{
                background: "var(--green-light)",
                borderRadius: "var(--radius-full)",
                padding: "6px 12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--green-dark)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <ArrowUpRight size={14} />
                +{percentage > 10 ? percentage - 10 : percentage}.00%
              </span>
              <span style={{ fontSize: 10, color: "var(--green-dark)", opacity: 0.7 }}>
                Increased since last month
              </span>
            </div>
          </div>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            {goal.name}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            {goal.status === "on_track"
              ? `You're on track! Keep it up 😊`
              : `Let's focus so we can reach this goal 🤩`}
          </p>
        </div>

        {/* ── Progress Card ──────────────────────────────── */}
        <div
          className="card animate-fade-up delay-100"
          style={{ padding: "18px", marginBottom: 16 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                color: "var(--text-primary)",
              }}
            >
              {formatCurrency(goal.currentAmount)}
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                color: "var(--text-secondary)",
              }}
            >
              {formatCurrency(goal.targetAmount)}
            </span>
          </div>

          <ProgressBar current={goal.currentAmount} target={goal.targetAmount} color={goal.color} height={8} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {daysLeft} days to go
              </span>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: goal.color }}>
                {percentage}%
              </span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {formatCurrency(remaining)} remaining
              </span>
            </div>
          </div>

          {/* Milestones */}
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            {[25, 50, 75, 100].map((milestone) => (
              <div
                key={milestone}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "6px 4px",
                  borderRadius: "var(--radius-sm)",
                  background: percentage >= milestone ? goal.color + "20" : "var(--bg-input)",
                  border: `1px solid ${percentage >= milestone ? goal.color : "transparent"}`,
                }}
              >
                <div style={{ fontSize: 14, marginBottom: 2 }}>
                  {percentage >= milestone ? "✓" : "○"}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: percentage >= milestone ? goal.color : "var(--text-muted)",
                  }}
                >
                  {milestone}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Saving Analytics ───────────────────────────── */}
        <div
          className="card animate-fade-up delay-150"
          style={{ padding: "18px", marginBottom: 16 }}
        >
          <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
            Saving Analytics
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
            Average per month{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {formatCurrency(Math.round(monthlyData.reduce((a, b) => a + b, 0) / monthlyData.length))}
            </strong>
          </p>

          <BarChart
            data={monthlyData}
            labels={ANALYTICS_DATA.months}
            color="#111111"
            height={130}
            showLabels
          />
        </div>

        {/* ── Transactions ───────────────────────────────── */}
        <div className="animate-fade-up delay-200">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Transactions</h2>
          <div className="card" style={{ padding: "4px 16px", marginBottom: 20 }}>
            {goalTransactions.map((tx, idx) => (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: idx < goalTransactions.length - 1 ? "1px solid var(--border-light)" : "none",
                }}
              >
                <div
                  className="icon-circle"
                  style={{
                    width: 40,
                    height: 40,
                    background: "var(--green-light)",
                    fontSize: 16,
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  🚀
                  {tx.positive && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        width: 14,
                        height: 14,
                        background: "var(--green)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: 8, color: "white", fontWeight: 700 }}>↑</span>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                    {tx.label}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{tx.sub}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  {tx.amount > 0 && (
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "var(--green)",
                      }}
                    >
                      +{formatCurrency(tx.amount)}
                    </p>
                  )}
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{tx.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ─────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 20px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
          background: "var(--bg-app)",
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <button
          className="btn-primary"
          id="goal-topup-btn"
          style={{ fontSize: 16 }}
        >
          <Plus size={20} />
          Top up
        </button>
      </div>
    </div>
  );
}
