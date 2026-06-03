"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Delete } from "lucide-react";

const NUMPAD_KEYS = [
  "1", "2", "3",
  "4", "5", "6",
  "7", "8", "9",
  "", "0", "⌫",
];

export default function PinPage() {
  const [pin, setPin] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleKey = (key: string) => {
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
      // Simulate PIN validation
      setTimeout(() => {
        if (newPin.join("") === "1234") {
          router.push("/dashboard");
        } else {
          setError(true);
          setTimeout(() => {
            setPin([]);
            setError(false);
          }, 600);
        }
      }, 200);
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
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "white",
            marginBottom: 8,
          }}
        >
          Enter your PIN
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
          Use PIN: <strong style={{ color: "rgba(255,255,255,0.7)" }}>1234</strong> to continue
        </p>
      </div>

      {/* PIN Dots */}
      <div style={{ display: "flex", gap: 20 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              background: pin.length > i
                ? error ? "var(--red)" : "var(--green)"
                : "transparent",
              transition: "all 0.15s ease",
              transform: pin.length > i ? "scale(1.1)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {error && (
        <p
          style={{
            fontSize: 13,
            color: "var(--red)",
            fontWeight: 500,
            animation: "fadeIn 0.2s ease",
          }}
        >
          Incorrect PIN, try again
        </p>
      )}

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
              cursor: key === "" ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.1s ease",
              outline: "none",
            }}
          >
            {key === "⌫" ? (
              <Delete size={20} strokeWidth={2} />
            ) : key}
          </button>
        ))}
      </div>

      {/* Biometric + Forgot */}
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <button
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
          }}
        >
          Use Face ID
        </button>
        <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
        <button
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
          }}
        >
          Forgot PIN?
        </button>
      </div>
    </div>
  );
}
