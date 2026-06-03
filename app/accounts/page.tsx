import { redirect } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import { ChevronRight, Plus, ArrowLeftRight } from "lucide-react";
import { getUser } from "@/lib/actions/auth";
import { getAccounts } from "@/lib/actions/accounts";
import { formatCurrency } from "@/lib/utils";

function AccountCard({ account, index }: { account: any; index: number }) {
  const isCreditCard = account.type === "credit";
  const balance = Math.abs(Number(account.balance));
  const creditLimit = Number(account.credit_limit) || 0;
  const creditPct = isCreditCard && creditLimit > 0
    ? Math.round((balance / creditLimit) * 100)
    : 0;

  return (
    <div
      className="card"
      id={`account-${account.id}`}
      style={{
        padding: "18px 16px",
        marginBottom: 12,
        borderLeft: `4px solid ${account.color}`,
        opacity: 0,
        animation: `fadeInUp 0.4s ease forwards`,
        animationDelay: `${index * 80}ms`,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Icon */}
        <div
          className="icon-circle"
          style={{
            width: 48,
            height: 48,
            background: account.color + "18",
            fontSize: 22,
          }}
        >
          {account.icon}
        </div>

        {/* Details */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>
            {account.name}
            {account.is_default && <span style={{ marginLeft: 6, fontSize: 10, background: "var(--bg-input)", padding: "2px 6px", borderRadius: 4, fontWeight: 500 }}>Default</span>}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            {account.type === "bank" && account.last_four ? `••• ${account.last_four}` : account.type}
            {account.type === "credit" && creditLimit ? ` · Limit ${formatCurrency(creditLimit)}` : ""}
          </p>
        </div>

        {/* Balance */}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 18,
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              color: isCreditCard ? "var(--red)" : "var(--text-primary)",
              marginBottom: isCreditCard ? 4 : 0,
            }}
          >
            {isCreditCard ? "-" : ""}{formatCurrency(balance)}
          </p>
          {isCreditCard && creditLimit > 0 && (
            <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {formatCurrency(Math.max(0, creditLimit - balance))} available
            </p>
          )}
        </div>

        <ChevronRight size={16} color="var(--text-muted)" />
      </div>

      {/* Credit card progress */}
      {isCreditCard && creditLimit > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 4, background: "var(--bg-input)", borderRadius: 99, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${creditPct}%`,
                background: creditPct > 80 ? "var(--red)" : creditPct > 50 ? "var(--orange)" : "var(--blue)",
                borderRadius: 99,
                transition: "width 0.8s ease",
              }}
            />
          </div>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
            {creditPct}% of credit limit used
          </p>
        </div>
      )}
    </div>
  );
}

export default async function AccountsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const accounts = await getAccounts();
  
  const netWorth = accounts.reduce((sum: number, a: any) => sum + Number(a.balance), 0);
  const assets = accounts.filter((a: any) => Number(a.balance) >= 0).reduce((sum: number, a: any) => sum + Number(a.balance), 0);
  const liabilities = Math.abs(accounts.filter((a: any) => Number(a.balance) < 0).reduce((sum: number, a: any) => sum + Number(a.balance), 0));

  return (
    <div className="page-container" id="accounts-page">
      <PageHeader
        title="Accounts"
        rightAction={
          <button className="header-icon-btn" aria-label="Add account" id="accounts-add-btn">
            <Plus size={18} color="var(--text-primary)" strokeWidth={2.5} />
          </button>
        }
      />

      <div style={{ padding: "0 20px" }}>
        {/* ── Net Worth Summary ──────────────────────── */}
        <div
          className="card-dark animate-fade-up"
          style={{ padding: "22px", marginBottom: 24 }}
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>Net Worth</p>
          <p
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "white",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            {formatCurrency(netWorth)}
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Assets</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", fontFamily: "'JetBrains Mono', monospace" }}>
                {formatCurrency(assets)}
              </p>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Liabilities</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--red)", fontFamily: "'JetBrains Mono', monospace" }}>
                {formatCurrency(liabilities)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Transfer Button ────────────────────────── */}
        <button
          className="btn-secondary animate-fade-up delay-100"
          id="accounts-transfer-btn"
          style={{ marginBottom: 20, gap: 8 }}
        >
          <ArrowLeftRight size={18} />
          Transfer Between Accounts
        </button>

        {/* ── Account Cards ──────────────────────────── */}
        <h2
          className="animate-fade-up delay-150"
          style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}
        >
          All Accounts
        </h2>
        {accounts.map((account: any, idx: number) => (
          <AccountCard key={account.id} account={account} index={idx} />
        ))}

        {accounts.length === 0 && (
          <div className="card" style={{ padding: "40px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>💳</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>No accounts yet</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Add an account to track your balances</p>
          </div>
        )}
      </div>

      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
