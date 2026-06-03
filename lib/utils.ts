import { Account, Category, SavingsGoal, Transaction, Bill, Contact, Budget, Investment } from "./types";

// ── Currency Formatter ───────────────────────────────────

export function formatCurrency(amount: number, symbol = "₹"): string {
  const absAmount = Math.abs(amount);
  if (absAmount >= 10_00_000) {
    return `${symbol}${(absAmount / 10_00_000).toFixed(1)}L`;
  }
  if (absAmount >= 1000) {
    return `${symbol}${absAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  }
  return `${symbol}${absAmount.toFixed(0)}`;
}

export function formatCurrencyFull(amount: number, symbol = "₹"): string {
  return `${symbol}${Math.abs(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ── Date Formatters ──────────────────────────────────────

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function getDaysRemaining(targetDate: Date): number {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getMonthName(month: number): string {
  return new Date(2024, month - 1).toLocaleString("en-IN", { month: "short" });
}

// ── Progress ─────────────────────────────────────────────

export function getProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

// ── Initials ─────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ── Color by percentage ──────────────────────────────────

export function getProgressColor(percentage: number): string {
  if (percentage >= 90) return "var(--red)";
  if (percentage >= 60) return "var(--orange)";
  return "var(--green)";
}

// ── Mock Data ────────────────────────────────────────────

export const MOCK_ACCOUNTS: Account[] = [
  { id: "acc-1", name: "HDFC Bank", type: "bank", balance: 45200, color: "#4F6EF7", icon: "🏦", lastFour: "4521" },
  { id: "acc-2", name: "Cash", type: "cash", balance: 2500, color: "#22C55E", icon: "💵" },
  { id: "acc-3", name: "PhonePe", type: "upi", balance: 1800, color: "#A855F7", icon: "📱" },
  { id: "acc-4", name: "HDFC Credit", type: "credit", balance: -8400, color: "#EF4444", icon: "💳", lastFour: "8823", limit: 100000 },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Food & Mess", icon: "🍽️", color: "#F97316", bgColor: "#FFEDD5", type: "expense" },
  { id: "cat-2", name: "Rent", icon: "🏠", color: "#4F6EF7", bgColor: "#EEF2FF", type: "expense" },
  { id: "cat-3", name: "Travel", icon: "✈️", color: "#22C55E", bgColor: "#DCFCE7", type: "expense" },
  { id: "cat-4", name: "Education", icon: "📚", color: "#A855F7", bgColor: "#F5F3FF", type: "expense" },
  { id: "cat-5", name: "Groceries", icon: "🛒", color: "#EAB308", bgColor: "#FEF9C3", type: "expense" },
  { id: "cat-6", name: "Health", icon: "💊", color: "#EF4444", bgColor: "#FEE2E2", type: "expense" },
  { id: "cat-7", name: "Entertainment", icon: "🎬", color: "#EC4899", bgColor: "#FCE7F3", type: "expense" },
  { id: "cat-8", name: "Utilities", icon: "⚡", color: "#14B8A6", bgColor: "#CCFBF1", type: "expense" },
  { id: "cat-9", name: "Tech & Gadgets", icon: "💻", color: "#6366F1", bgColor: "#EEF2FF", type: "expense" },
  { id: "cat-10", name: "Cafe & Snacks", icon: "☕", color: "#92400E", bgColor: "#FEF3C7", type: "expense" },
  { id: "cat-11", name: "Fuel", icon: "⛽", color: "#64748B", bgColor: "#F1F5F9", type: "expense" },
  { id: "cat-12", name: "Other", icon: "📦", color: "#6B7280", bgColor: "#F3F4F6", type: "expense" },
  { id: "cat-13", name: "Salary", icon: "💰", color: "#22C55E", bgColor: "#DCFCE7", type: "income" },
  { id: "cat-14", name: "Freelance", icon: "💼", color: "#4F6EF7", bgColor: "#EEF2FF", type: "income" },
  { id: "cat-15", name: "Pocket Money", icon: "👜", color: "#F97316", bgColor: "#FFEDD5", type: "income" },
  { id: "cat-16", name: "Gifts & Clothing", icon: "🎁", color: "#EC4899", bgColor: "#FCE7F3", type: "expense" },
];

export const MOCK_GOALS: SavingsGoal[] = [
  {
    id: "goal-1",
    name: "Summer Vacation",
    icon: "🚗",
    targetAmount: 50000,
    currentAmount: 15000,
    targetDate: new Date(2025, 11, 20),
    monthlyContribution: 2500,
    color: "#22C55E",
    status: "on_track",
  },
  {
    id: "goal-2",
    name: "Real Estate Fund",
    icon: "🏢",
    targetAmount: 230000,
    currentAmount: 60500,
    targetDate: new Date(2027, 5, 1),
    monthlyContribution: 8000,
    color: "#F97316",
    status: "on_track",
  },
  {
    id: "goal-3",
    name: "Master's Education",
    icon: "🎓",
    targetAmount: 100000,
    currentAmount: 22000,
    targetDate: new Date(2026, 7, 1),
    monthlyContribution: 5000,
    color: "#4F6EF7",
    status: "falling_behind",
  },
  {
    id: "goal-4",
    name: "Emergency Fund",
    icon: "🛡️",
    targetAmount: 150000,
    currentAmount: 75000,
    targetDate: new Date(2025, 8, 30),
    monthlyContribution: 10000,
    color: "#A855F7",
    status: "on_track",
  },
  {
    id: "goal-5",
    name: "New MacBook",
    icon: "💻",
    targetAmount: 120000,
    currentAmount: 36000,
    targetDate: new Date(2025, 11, 25),
    monthlyContribution: 12000,
    color: "#14B8A6",
    status: "on_track",
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "tx-1", accountId: "acc-1", categoryId: "cat-1", amount: 180, type: "expense", date: new Date(2025, 5, 3, 13, 30), note: "Lunch at Mess" },
  { id: "tx-2", accountId: "acc-3", categoryId: "cat-5", amount: 680, type: "expense", date: new Date(2025, 5, 3, 10, 15), note: "Weekly groceries" },
  { id: "tx-3", accountId: "acc-1", categoryId: "cat-13", amount: 45000, type: "income", date: new Date(2025, 5, 1, 9, 0), note: "June Salary" },
  { id: "tx-4", accountId: "acc-2", categoryId: "cat-10", amount: 320, type: "expense", date: new Date(2025, 5, 2, 18, 45), note: "Coffee with Rahul" },
  { id: "tx-5", accountId: "acc-1", categoryId: "cat-7", amount: 499, type: "expense", date: new Date(2025, 5, 2, 20, 0), note: "Netflix subscription" },
  { id: "tx-6", accountId: "acc-1", categoryId: "cat-3", amount: 1200, type: "expense", date: new Date(2025, 5, 1, 7, 30), note: "Train to Mumbai" },
  { id: "tx-7", accountId: "acc-1", categoryId: "cat-4", amount: 2500, type: "expense", date: new Date(2025, 4, 31, 11, 0), note: "Online course" },
  { id: "tx-8", accountId: "acc-3", categoryId: "cat-14", amount: 8000, type: "income", date: new Date(2025, 4, 29, 14, 0), note: "Freelance project" },
];

export const MOCK_BILLS: Bill[] = [
  { id: "bill-1", name: "Netflix", amount: 499, dueDate: new Date(2025, 5, 5), frequency: "monthly", categoryId: "cat-7", accountId: "acc-1", status: "due_soon", icon: "🎬" },
  { id: "bill-2", name: "Rent", amount: 12000, dueDate: new Date(2025, 5, 7), frequency: "monthly", categoryId: "cat-2", accountId: "acc-1", status: "upcoming", icon: "🏠" },
  { id: "bill-3", name: "Electricity", amount: 1850, dueDate: new Date(2025, 5, 2), frequency: "monthly", categoryId: "cat-8", accountId: "acc-1", status: "overdue", icon: "⚡" },
  { id: "bill-4", name: "Hotstar", amount: 299, dueDate: new Date(2025, 5, 10), frequency: "monthly", categoryId: "cat-7", accountId: "acc-3", status: "upcoming", icon: "📺" },
  { id: "bill-5", name: "Gym Membership", amount: 800, dueDate: new Date(2025, 5, 15), frequency: "monthly", categoryId: "cat-6", accountId: "acc-1", status: "upcoming", icon: "🏋️" },
  { id: "bill-6", name: "Internet", amount: 699, dueDate: new Date(2025, 5, 20), frequency: "monthly", categoryId: "cat-8", accountId: "acc-1", status: "upcoming", icon: "🌐" },
];

export const MOCK_CONTACTS: Contact[] = [
  { id: "c-1", name: "Rahul Sharma", phone: "+91 98765 43210", netBalance: 750, avatarColor: "#4F6EF7" },
  { id: "c-2", name: "Dharini Patel", phone: "+91 87654 32109", netBalance: 450, avatarColor: "#22C55E" },
  { id: "c-3", name: "Mahek Joshi", phone: "+91 76543 21098", netBalance: -200, avatarColor: "#A855F7" },
  { id: "c-4", name: "Hetavi Shah", phone: "+91 65432 10987", netBalance: 325, avatarColor: "#F97316" },
  { id: "c-5", name: "Aryan Mehta", phone: "+91 54321 09876", netBalance: -580, avatarColor: "#EF4444" },
];

export const MOCK_BUDGETS: Budget[] = [
  { id: "b-1", categoryId: "cat-1", month: 6, year: 2025, limitAmount: 5000, spentAmount: 3800 },
  { id: "b-2", categoryId: "cat-5", month: 6, year: 2025, limitAmount: 3000, spentAmount: 2100 },
  { id: "b-3", categoryId: "cat-7", month: 6, year: 2025, limitAmount: 1500, spentAmount: 1380 },
  { id: "b-4", categoryId: "cat-3", month: 6, year: 2025, limitAmount: 4000, spentAmount: 1200 },
  { id: "b-5", categoryId: "cat-10", month: 6, year: 2025, limitAmount: 2000, spentAmount: 980 },
  { id: "b-6", categoryId: "cat-8", month: 6, year: 2025, limitAmount: 3500, spentAmount: 2549 },
];

export const MOCK_INVESTMENTS: Investment[] = [
  { id: "inv-1", type: "Mutual Fund (SIP)", name: "Mirae Asset Large Cap", buyPrice: 50000, units: 120, currentPrice: 68500, buyDate: new Date(2024, 0, 15), color: "#4F6EF7" },
  { id: "inv-2", type: "Stocks", name: "HDFC Bank (HDFCBANK)", buyPrice: 15000, units: 10, currentPrice: 18600, buyDate: new Date(2024, 2, 1), color: "#22C55E" },
  { id: "inv-3", type: "Fixed Deposit", name: "SBI FD (6.8%)", buyPrice: 25000, units: 1, currentPrice: 26700, buyDate: new Date(2024, 3, 10), color: "#F97316" },
  { id: "inv-4", type: "Digital Gold", name: "Gold ETF", buyPrice: 8000, units: 2.3, currentPrice: 9200, buyDate: new Date(2024, 5, 20), color: "#EAB308" },
];

export const ANALYTICS_DATA = {
  monthlyIncome: [28000, 45000, 42000, 45000, 53000, 45000],
  monthlyExpense: [22000, 31000, 28000, 35000, 32000, 28000],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  savingsHistory: [1202, 980, 1500, 2100, 1800, 2500],
};

export function getTotalBalance(accounts: Account[]): number {
  return accounts.reduce((sum, acc) => sum + acc.balance, 0);
}

export function getMonthlyIncome(transactions: Transaction[]): number {
  const now = new Date();
  return transactions
    .filter((tx) => tx.type === "income" && tx.date.getMonth() === now.getMonth())
    .reduce((sum, tx) => sum + tx.amount, 0);
}

export function getMonthlyExpense(transactions: Transaction[]): number {
  const now = new Date();
  return transactions
    .filter((tx) => tx.type === "expense" && tx.date.getMonth() === now.getMonth())
    .reduce((sum, tx) => sum + tx.amount, 0);
}
