"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Delete, Loader2 } from "lucide-react";
import { verifyPIN } from "@/lib/actions/auth";

const NUMPAD_KEYS = [
  "1", "2", "3",
  "4", "5", "6",
  "7", "8", "9",
  "", "0", "⌫",
];

export default function PinPage() {
  const [pin, setPin] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleKey = async (key: string) => {
    if (loading) return;
    if (key === "⌫") {
      setPin((prev) => prev.slice(0, -1));
      setError(false);
      return;
    }
    if (key === "") return;
    if (pin.length >= 4) return;

    const newPin = [...pin, key];
    setPin(newPin);

    if (newPin.length === 4) {
      setLoading(true);
      const pinString = newPin.join("");
      const isValid = await verifyPIN(pinString);
      setLoading(false);

      if (isValid) {
        router.push("/dashboard");
      } else {
        setError(true);
        setTimeout(() => {
          setPin([]);
          setError(false);
        }, 700);
      }
    }
  };

  return (
    <div
      id="pin-screen"
      style={{
        minHeight: "100dvh",
        background: "var(--bg-dark)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "60px 32px 48px",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 60px)",
      }}
    >
      {/* Top */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            margin: "0 auto 24px",
          }}
        >
          🔐
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>
          Enter your PIN
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
          Verify your identity to continue
        </p>
      </div>

      {/* PIN Dots */}
      <div style={{ display: "flex", gap: 20, flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 20 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.3)",
                background: loading
                  ? "rgba(255,255,255,0.5)"
                  : pin.length > i
                    ? error ? "var(--red)" : "var(--green)"
                    : "transparent",
                transition: "all 0.15s ease",
                transform: pin.length > i ? "scale(1.1)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ fontSize: 13, color: "var(--red)", fontWeight: 500 }}>
            Incorrect PIN, try again
          </p>
        )}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Loader2 size={16} color="rgba(255,255,255,0.5)" className="animate-spin" />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Verifying…</span>
          </div>
        )}
      </div>

      {/* Numpad */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          width: "100%",
          maxWidth: 300,
        }}
      >
        {NUMPAD_KEYS.map((key, idx) => (
          <button
            key={idx}
            id={`pin-key-${key || "empty"}`}
            onClick={() => handleKey(key)}
            style={{
              height: 68,
              borderRadius: "var(--radius-xl)",
              background: key === "" ? "transparent" : "rgba(255,255,255,0.08)",
              border: key === "" ? "none" : "1px solid rgba(255,255,255,0.06)",
              color: "white",
              fontSize: key === "⌫" ? 20 : 24,
              fontWeight: key === "⌫" ? 400 : 600,
              fontFamily: "'Inter', sans-serif",
              cursor: key === "" ? "default" : loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.1s ease",
              outline: "none",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {key === "⌫" ? <Delete size={20} strokeWidth={2} /> : key}
          </button>
        ))}
      </div>

      {/* Footer Links */}
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <button
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
          }}
          onClick={() => router.push("/auth/signin")}
        >
          Sign in differently
        </button>
      </div>
    </div>
  );
}
