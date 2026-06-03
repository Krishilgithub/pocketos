"use client";

import { formatCurrency, formatTime } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import { MOCK_CATEGORIES } from "@/lib/utils";

interface TransactionItemProps {
  transaction: Transaction;
  showDate?: boolean;
}

export default function TransactionItem({ transaction, showDate = false }: TransactionItemProps) {
  const category = MOCK_CATEGORIES.find((c) => c.id === transaction.categoryId);
  const isIncome = transaction.type === "income";

  return (
    <div className="tx-item" id={`tx-${transaction.id}`}>
      {/* Icon */}
      <div
        className="icon-circle"
        style={{
          width: 44,
          height: 44,
          background: category?.bgColor || "#F3F4F6",
          fontSize: 18,
          flexShrink: 0,
        }}
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
          {showDate && ` · ${transaction.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
          {" · "}{formatTime(transaction.date)}
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
          {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
}
