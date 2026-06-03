"use client";

import { useState } from "react";
import { Mail, ArrowRight, Shield, Loader2, KeyRound } from "lucide-react";
import { signInWithGoogle, signInWithEmail, signInWithPIN } from "@/lib/actions/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [isReturningUser, setIsReturningUser] = useState(true);
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setLoading("google");
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e?.message || "Failed to sign in with Google");
      setLoading(null);
    }
  };

  const handleEmail = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    setLoading("email");
    setError(null);
    const result = await signInWithEmail(email);
    setLoading(null);
    if (result?.error) {
      setError(result.error);
    } else {
      setOtpSent(true);
    }
  };

  const handlePinLogin = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }
    setLoading("email");
    setError(null);
    const result = await signInWithPIN(email, pin);
    if (result?.error) {
      setError(result.error);
      setLoading(null);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div
      id="signin-page"
      style={{
        minHeight: "100dvh",
        background: "var(--bg-app)",
        display: "flex",
        flexDirection: "column",
        padding: "0 24px",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* Top Illustration Area */}
      <div
        style={{
          height: "38vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 28,
          gap: 16,
        }}
      >
        <div
          className="animate-scale-in"
          style={{
            width: 80,
            height: 80,
            background: "var(--bg-dark)",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
          }}
        >
          💰
        </div>
        <div className="animate-fade-up delay-100" style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            {otpSent ? "Check your email 📬" : "Welcome to PocketOS 👋"}
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
            {otpSent
              ? `We've sent a magic link to ${email}`
              : "Sign in to manage your finances"}
          </p>
        </div>
      </div>

      {!otpSent ? (
        <div className="animate-fade-up delay-200" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Error */}
          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "var(--red-light)",
                borderRadius: "var(--radius-md)",
                fontSize: 13,
                color: "var(--red)",
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          {/* Google OAuth */}
          <button
            id="signin-google-btn"
            onClick={handleGoogle}
            disabled={loading !== null}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              height: 56,
              background: "var(--bg-card)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-full)",
              cursor: loading !== null ? "not-allowed" : "pointer",
              boxShadow: "var(--shadow-card)",
              opacity: loading !== null ? 0.7 : 1,
              transition: "all 0.15s ease",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {loading === "google" ? (
              <Loader2 size={20} className="animate-spin" color="var(--text-secondary)" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Email OTP */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 56,
                background: "var(--bg-card)",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-md)",
                paddingLeft: 16,
                gap: 12,
                boxShadow: "var(--shadow-card)",
              }}
            >
              <Mail size={18} color="var(--text-muted)" />
              <input
                type="email"
                placeholder="Enter your email"
                id="signin-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmail()}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 15,
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {isReturningUser && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 56,
                  background: "var(--bg-card)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  paddingLeft: 16,
                  marginTop: 12,
                  gap: 12,
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <KeyRound size={18} color="var(--text-muted)" />
                <input
                  type="password"
                  placeholder="4-digit PIN"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handlePinLogin()}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 15,
                    fontFamily: "'Inter', sans-serif",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            )}

            {isReturningUser ? (
              <>
                <button
                  className="btn-primary"
                  onClick={handlePinLogin}
                  disabled={loading !== null || pin.length < 4}
                  style={{
                    marginTop: 12,
                    opacity: loading !== null || pin.length < 4 ? 0.7 : 1,
                    cursor: loading !== null || pin.length < 4 ? "not-allowed" : "pointer",
                  }}
                >
                  {loading === "email" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Login with PIN <ArrowRight size={18} /></>
                  )}
                </button>
                <button
                  onClick={() => setIsReturningUser(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    fontSize: 13,
                    marginTop: 16,
                    cursor: "pointer",
                    fontWeight: 500,
                    textDecoration: "underline",
                    display: "block",
                    width: "100%",
                  }}
                >
                  Forgot PIN or New User?
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-primary"
                  onClick={handleEmail}
                  disabled={loading !== null}
                  style={{
                    marginTop: 12,
                    opacity: loading !== null ? 0.7 : 1,
                    cursor: loading !== null ? "not-allowed" : "pointer",
                  }}
                >
                  {loading === "email" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Send Magic Link <ArrowRight size={18} /></>
                  )}
                </button>
                <button
                  onClick={() => setIsReturningUser(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    fontSize: 13,
                    marginTop: 16,
                    cursor: "pointer",
                    fontWeight: 500,
                    textDecoration: "underline",
                    display: "block",
                    width: "100%",
                  }}
                >
                  I remember my PIN
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              paddingBottom: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Shield size={13} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Your data is encrypted &amp; private
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* OTP Sent State */
        <div
          className="animate-fade-up delay-200"
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 32 }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: "var(--green-light)",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
            }}
          >
            📬
          </div>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.6, maxWidth: 280 }}>
            Click the magic link in your email to sign in. No password needed!
          </p>
          <button
            onClick={() => { setOtpSent(false); setEmail(""); }}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Try a different email
          </button>
        </div>
      )}
    </div>
  );
}
