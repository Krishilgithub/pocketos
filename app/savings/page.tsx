"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Target } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import GoalCard from "@/components/ui/GoalCard";
import FAB from "@/components/layout/FAB";
import {
  MOCK_GOALS,
  formatCurrency,
} from "@/lib/utils";

export default function SavingsPage() {
  const totalSaved = MOCK_GOALS.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = MOCK_GOALS.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = Math.round((totalSaved / totalTarget) * 100);

  return (
    <div className="page-container" id="savings-page">
      <PageHeader
        title="Savings Goals"
        rightAction={
          <button className="header-icon-btn" aria-label="New goal" id="savings-new-goal-btn">
            <Plus size={18} color="var(--text-primary)" strokeWidth={2.5} />
          </button>
        }
      />

      <div style={{ padding: "0 20px 24px" }}>
        {/* ── Total Saved Card (dark) ──────────────────── */}
        <div
          className="card-dark animate-fade-up"
          style={{ padding: "22px", marginBottom: 24 }}
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500, marginBottom: 6 }}>
            Total Saved
          </p>
          <p
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "white",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            {formatCurrency(totalSaved)}
          </p>

          {/* Overall progress */}
          <div
            style={{
              height: 5,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 99,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${overallProgress}%`,
                background: "var(--green)",
                borderRadius: 99,
                transition: "width 0.8s ease",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              {overallProgress}% of {formatCurrency(totalTarget)} total goal
            </span>
            <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>
              {MOCK_GOALS.filter((g) => g.status === "on_track").length} on track
            </span>
          </div>
        </div>

        {/* ── Goals List ─────────────────────────────── */}
        <div className="animate-fade-up delay-100">
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["All", "On Track", "Falling Behind"].map((tab, idx) => (
              <button
                key={tab}
                className={`filter-chip ${idx === 0 ? "active" : ""}`}
                id={`savings-tab-${tab.toLowerCase().replace(" ", "-")}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {MOCK_GOALS.map((goal, idx) => (
            <GoalCard key={goal.id} goal={goal} index={idx} />
          ))}
        </div>
      </div>

      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
