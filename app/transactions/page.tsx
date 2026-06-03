import { redirect } from "next/navigation";
import { getUser } from "@/lib/actions/auth";
import { getTransactions, getMonthlyStats } from "@/lib/actions/transactions";
import { getCategories } from "@/lib/actions/budgets";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import TransactionItem from "@/components/ui/TransactionItem";
import FAB from "@/components/layout/FAB";
import TransactionFilters from "@/components/ui/TransactionFilters";
import { formatCurrency } from "@/lib/utils";

export default async function TransactionsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const [transactions, stats] = await Promise.all([
    getTransactions({ limit: 50 }),
    getMonthlyStats(),
  ]);

  // Group by date
  const grouped: Record<string, typeof transactions> = {};
  for (const tx of transactions) {
    const key = new Date(tx.date).toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short"
    });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(tx);
  }

  return (
    <div className="page-container" id="transactions-page">
      <PageHeader title="Transactions" />

      <div style={{ padding: "0 20px" }}>
        {/* Summary */}
        <div className="card animate-fade-up" style={{ padding: "16px", marginBottom: 20, display: "flex", gap: 0 }}>
          <div style={{ flex: 1, textAlign: "center", borderRight: "1px solid var(--border-light)" }}>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 4 }}>Income</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "var(--green)", fontFamily: "'JetBrains Mono', monospace" }}>
              +{formatCurrency(stats.income)}
            </p>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 4 }}>Expenses</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "var(--red)", fontFamily: "'JetBrains Mono', monospace" }}>
              -{formatCurrency(stats.expense)}
            </p>
          </div>
        </div>

        {/* Grouped Transactions */}
        <div className="animate-fade-up delay-100">
          {Object.entries(grouped).map(([date, txs]) => (
            <div key={date} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {date}
              </p>
              <div className="card" style={{ padding: "4px 16px" }}>
                {txs.map((tx: any) => (
                  <TransactionItem key={tx.id} transaction={tx} category={tx.category} />
                ))}
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="card" style={{ padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>📊</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>No transactions yet</p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Add your first expense or income</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
