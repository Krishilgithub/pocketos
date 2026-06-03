"use client";

import { formatCurrency, formatTime } from "@/lib/utils";

interface CategoryLike {
  name: string;
  icon: string;
  bg_color?: string;
  bgColor?: string;
  color?: string;
}

interface TransactionLike {
  id: string;
  amount: number;
  type: "expense" | "income" | "transfer";
  date: string | Date;
  note?: string;
}

interface TransactionItemProps {
  transaction: TransactionLike;
  category?: CategoryLike | null;
  showDate?: boolean;
}

export default function TransactionItem({ transaction, category, showDate = false }: TransactionItemProps) {
  const isIncome = transaction.type === "income";
  const date = transaction.date instanceof Date ? transaction.date : new Date(transaction.date);
  const bgColor = category?.bg_color || category?.bgColor || "#F3F4F6";

  return (
    <div className="tx-item" id={`tx-${transaction.id}`}>
      {/* Icon */}
      <div
        className="icon-circle"
        style={{ width: 44, height: 44, background: bgColor, fontSize: 18, flexShrink: 0 }}
      >
        {category?.icon || "📦"}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {transaction.note || category?.name || "Transaction"}
        </p>
        <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          {category?.name}
          {showDate && ` · ${date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
          {" · "}{formatTime(date)}
        </p>
      </div>

      {/* Amount */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            color: isIncome ? "var(--green)" : "var(--text-primary)",
          }}
        >
          {isIncome ? "+" : "-"}{formatCurrency(Number(transaction.amount))}
        </p>
      </div>
    </div>
  );
}
