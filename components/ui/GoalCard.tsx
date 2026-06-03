"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SavingsGoal } from "@/lib/types";
import { formatCurrency, getDaysRemaining, getProgress } from "@/lib/utils";
import ProgressBar from "./ProgressBar";

interface GoalCardProps {
  goal: SavingsGoal;
  style?: React.CSSProperties;
  index?: number;
}

export default function GoalCard({ goal, style, index = 0 }: GoalCardProps) {
  const daysLeft = getDaysRemaining(goal.targetDate);
  const percentage = getProgress(goal.currentAmount, goal.targetAmount);

  return (
    <Link
      href={`/savings/${goal.id}`}
      className="card card-hover"
      id={`goal-card-${goal.id}`}
      style={{
        display: "block",
        padding: "16px",
        marginBottom: 12,
        textDecoration: "none",
        opacity: 0,
        animation: `fadeInUp 0.4s ease forwards`,
        animationDelay: `${index * 80}ms`,
        ...style,
      }}
    >
      {/* Top Row: Icon + Name + Chevron */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div
          className="icon-circle"
          style={{
            width: 44,
            height: 44,
            background: goal.color + "20",
            fontSize: 20,
          }}
        >
          {goal.icon}
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 2,
            }}
          >
            {goal.name}
          </p>
          {goal.status === "on_track" ? (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--green-dark)",
                background: "var(--green-light)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
              }}
            >
              ✓ On track
            </span>
          ) : goal.status === "completed" ? (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "white",
                background: "var(--green)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
              }}
            >
              🎉 Completed
            </span>
          ) : (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--orange)",
                background: "var(--orange-light)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
              }}
            >
              ⚠ Falling behind
            </span>
          )}
        </div>
        <ChevronRight size={18} color="var(--text-muted)" />
      </div>

      {/* Amount row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-primary)" }}>
          {formatCurrency(goal.currentAmount)}
        </span>
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>
          {formatCurrency(goal.targetAmount)}
        </span>
      </div>

      {/* Progress bar */}
      <ProgressBar current={goal.currentAmount} target={goal.targetAmount} color={goal.color} height={5} />

      {/* Footer row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          {daysLeft > 0 ? `${daysLeft} days to go` : "Past due"}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
          {percentage}%
        </span>
      </div>
    </Link>
  );
}
