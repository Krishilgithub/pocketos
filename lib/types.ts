// ── Types ────────────────────────────────────────────────

export type TransactionType = "expense" | "income" | "transfer";
export type AccountType = "cash" | "bank" | "upi" | "credit";
export type GoalStatus = "on_track" | "falling_behind" | "completed";
export type BillStatus = "upcoming" | "due_soon" | "overdue" | "paid";
export type SplitType = "equal" | "exact" | "percentage" | "shares";
export type FrequencyType = "daily" | "weekly" | "monthly" | "custom";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color: string;
  icon: string;
  lastFour?: string;
  limit?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  type: "expense" | "income" | "both";
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  date: Date;
  note: string;
  tags?: string[];
  isRecurring?: boolean;
  splitId?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  monthlyContribution?: number;
  color: string;
  status: GoalStatus;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  frequency: FrequencyType;
  categoryId: string;
  accountId: string;
  status: BillStatus;
  icon: string;
}

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  upiId?: string;
  netBalance: number; // positive = they owe you, negative = you owe them
  avatarColor: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  month: number;
  year: number;
  limitAmount: number;
  spentAmount: number;
}

export interface Investment {
  id: string;
  type: string;
  name: string;
  buyPrice: number;
  units: number;
  currentPrice: number;
  buyDate: Date;
  color: string;
}
