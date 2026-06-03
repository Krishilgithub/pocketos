"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { addTransaction } from "@/lib/actions/transactions";

const NUMPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

type TxType = "expense" | "income";

export default function AddTransactionClient({ categories, accounts }: { categories: any[], accounts: any[] }) {
  const router = useRouter();
  const [amount, setAmount] = useState("0");
  const [txType, setTxType] = useState<TxType>("expense");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNumpad = (key: string) => {
    if (key === "⌫") {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      return;
    }
    if (key === "." && amount.includes(".")) return;
    if (amount === "0" && key !== ".") {
      setAmount(key);
    } else {
      const newAmount = amount + key;
      if (newAmount.replace(".", "").length > 10) return;
      setAmount(newAmount);
    }
  };

  const handleSave = async () => {
    if (amount === "0" || !selectedCategory) return;
    
    // Auto-select primary account if none specified
    const account = accounts.find(a => a.is_default) || accounts[0];
    if (!account) {
      alert("Please add an account first.");
      return;
    }

    setLoading(true);
    const result = await addTransaction({
      account_id: account.id,
      category_id: selectedCategory,
      amount: parseFloat(amount),
      type: txType,
      date: new Date().toISOString(),
      note: note.trim(),
    });

    setLoading(false);
    if (result.success) {
      router.back();
    } else {
      alert(result.error);
    }
  };

  const filteredCategories = categories.filter(
    (c) => c.type === txType || c.type === "both"
  );

  return (
    <div
      id="add-transaction-page"
      style={{
        minHeight: "100dvh",
        background: "var(--bg-app)",
        display: "flex",
        flexDirection: "column",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <div
        style={{
          padding: "20px 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button className="header-icon-btn" onClick={() => router.back()} style={{ border: "none", background: "none", cursor: "pointer" }}>
          <X size={18} color="var(--text-primary)" />
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 600, color: "var(--text-primary)" }}>
          Add Transaction
        </h1>
        <div style={{ width: 40 }} />
      </div>

      {/* ── Type Toggle ─────────────────────────────────── */}
      <div style={{ padding: "16px 20px 0" }}>
        <div className="tab-bar">
          {(["expense", "income"] as TxType[]).map((type) => (
            <button
              key={type}
              className={`tab-item ${txType === type ? "active" : ""}`}
              id={`add-type-${type}`}
              onClick={() => { setTxType(type); setSelectedCategory(null); }}
              style={{ textTransform: "capitalize" }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ── Amount Display ──────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 20px 16px",
        }}
      >
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>
          {txType === "expense" ? "How much did you spend?" : "How much did you earn?"}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "var(--text-secondary)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            ₹
          </span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: txType === "income" ? "var(--green)" : "var(--text-primary)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {parseFloat(amount).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Selected category display */}
        {selectedCategory && (
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: 16 }}>
              {categories.find((c) => c.id === selectedCategory)?.icon}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
              {categories.find((c) => c.id === selectedCategory)?.name}
            </span>
          </div>
        )}
      </div>

      {/* ── Category Grid ──────────────────────────────── */}
      <div
        style={{
          padding: "0 20px 12px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          maxHeight: "180px",
          overflowY: "auto"
        }}
      >
        {filteredCategories.map((cat) => (
          <button
            key={cat.id}
            className={`category-card ${selectedCategory === cat.id ? "selected" : ""}`}
            id={`add-cat-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
            style={{ padding: "8px 4px" }}
          >
            <span style={{ fontSize: 22 }}>{cat.icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: selectedCategory === cat.id ? "white" : "var(--text-secondary)",
                textAlign: "center",
                lineHeight: 1.2,
                marginTop: 4,
              }}
            >
              {cat.name.length > 10 ? cat.name.substring(0, 9) + "…" : cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* ── Note Field ─────────────────────────────────── */}
      <div style={{ padding: "0 20px 12px" }}>
        <input
          type="text"
          placeholder="Add a note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          id="add-note-input"
          style={{
            width: "100%",
            height: 44,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "0 16px",
            fontSize: 14,
            fontFamily: "'Inter', sans-serif",
            color: "var(--text-primary)",
            outline: "none",
          }}
        />
      </div>

      {/* ── Numpad ─────────────────────────────────────── */}
      <div
        style={{
          padding: "0 20px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}
      >
        {NUMPAD_KEYS.map((key, idx) => (
          <button
            key={idx}
            className="numpad-key"
            id={`add-numpad-${key === "⌫" ? "backspace" : key === "." ? "dot" : key}`}
            onClick={() => handleNumpad(key)}
          >
            {key}
          </button>
        ))}
      </div>

      {/* ── Save Button ────────────────────────────────── */}
      <div
        style={{
          padding: "16px 20px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        }}
      >
        <button
          className="btn-primary"
          id="add-save-btn"
          onClick={handleSave}
          disabled={amount === "0" || !selectedCategory || loading}
          style={{
            opacity: amount === "0" || !selectedCategory || loading ? 0.4 : 1,
            fontSize: 16,
            transition: "opacity 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Save Transaction"}
        </button>
      </div>
    </div>
  );
}
