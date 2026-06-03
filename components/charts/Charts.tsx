"use client";

import { ANALYTICS_DATA, formatCurrency } from "@/lib/utils";

interface BarChartProps {
  data?: number[];
  labels?: string[];
  color?: string;
  height?: number;
  showLabels?: boolean;
}

export default function BarChart({
  data = ANALYTICS_DATA.savingsHistory,
  labels = ANALYTICS_DATA.months,
  color = "#111111",
  height = 140,
  showLabels = true,
}: BarChartProps) {
  const max = Math.max(...data) * 1.2;

  return (
    <div style={{ width: "100%", paddingTop: 8 }}>
      {/* Bar Group */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          height,
        }}
      >
        {data.map((value, idx) => {
          const barHeight = (value / max) * height;
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${barHeight}px`,
                  background: color,
                  borderRadius: "6px 6px 0 0",
                  transition: `height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 60}ms`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Diagonal stripe texture */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.05) 4px, rgba(255,255,255,0.05) 8px)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis divider */}
      <div style={{ height: 1, background: "var(--border-light)", margin: "6px 0 8px" }} />

      {/* Labels */}
      {showLabels && (
        <div style={{ display: "flex", gap: 8 }}>
          {labels.map((label, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 10,
                fontWeight: 500,
                color: "var(--text-secondary)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface IncomeExpenseChartProps {
  incomeData?: number[];
  expenseData?: number[];
  labels?: string[];
  height?: number;
}

export function IncomeExpenseChart({
  incomeData = ANALYTICS_DATA.monthlyIncome,
  expenseData = ANALYTICS_DATA.monthlyExpense,
  labels = ANALYTICS_DATA.months,
  height = 160,
}: IncomeExpenseChartProps) {
  const max = Math.max(...incomeData, ...expenseData) * 1.2;

  return (
    <div style={{ width: "100%", paddingTop: 8 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height }}>
        {labels.map((_, idx) => (
          <div
            key={idx}
            style={{ flex: 1, display: "flex", gap: 3, alignItems: "flex-end", height: "100%" }}
          >
            {/* Income bar */}
            <div
              style={{
                flex: 1,
                height: `${(incomeData[idx] / max) * height}px`,
                background: "var(--green)",
                borderRadius: "4px 4px 0 0",
                transition: `height 0.6s ease ${idx * 60}ms`,
              }}
            />
            {/* Expense bar */}
            <div
              style={{
                flex: 1,
                height: `${(expenseData[idx] / max) * height}px`,
                background: "var(--red)",
                borderRadius: "4px 4px 0 0",
                transition: `height 0.6s ease ${idx * 60}ms`,
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "var(--border-light)", margin: "6px 0 8px" }} />
      <div style={{ display: "flex", gap: 6 }}>
        {labels.map((label, idx) => (
          <div
            key={idx}
            style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--text-secondary)", fontWeight: 500 }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 120 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulativePercent = 0;

  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = data.map((d) => {
    const percent = d.value / total;
    const offset = circumference * (1 - cumulativePercent);
    cumulativePercent += percent;
    return { ...d, percent, offset, dash: circumference * percent - 4 };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {segments.map((seg, idx) => (
          <circle
            key={idx}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${seg.dash} ${circumference}`}
            strokeDashoffset={seg.offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ))}
      </svg>
      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {data.slice(0, 5).map((d, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: d.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>{d.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
