"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/signin");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      id="splash-screen"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(160deg, #0A0A0A 0%, #1A1A1A 50%, #0F0F0F 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        className="animate-scale-in"
        style={{
          width: 88,
          height: 88,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
          fontSize: 40,
        }}
      >
        💰
      </div>

      {/* App Name */}
      <div className="animate-fade-up delay-200" style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          PocketOS
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
          Your money, organized.
        </p>
      </div>

      {/* Loading bar */}
      <div
        className="animate-fade-in delay-400"
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 48,
        }}
      >
        <div
          style={{
            height: 3,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--green)",
              borderRadius: 99,
              animation: "splashLoad 1.8s ease forwards",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes splashLoad {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
