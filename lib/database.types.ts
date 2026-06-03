export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          currency: string;
          pin_hash: string | null;
          pin_enabled: boolean;
          theme: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          avatar_url?: string | null;
          currency?: string;
          pin_hash?: string | null;
          pin_enabled?: boolean;
          theme?: string;
        };
        Update: {
          full_name?: string;
          avatar_url?: string | null;
          currency?: string;
          pin_hash?: string | null;
          pin_enabled?: boolean;
          theme?: string;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: "cash" | "bank" | "upi" | "credit";
          balance: number;
          color: string;
          icon: string;
          last_four: string | null;
          credit_limit: number | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: "cash" | "bank" | "upi" | "credit";
          balance?: number;
          color?: string;
          icon?: string;
          last_four?: string | null;
          credit_limit?: number | null;
          is_default?: boolean;
        };
        Update: {
          name?: string;
          balance?: number;
          color?: string;
          icon?: string;
          last_four?: string | null;
          credit_limit?: number | null;
          is_default?: boolean;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          icon: string;
          color: string;
          bg_color: string;
          type: "expense" | "income" | "both";
          is_default: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          icon: string;
          color: string;
          bg_color: string;
          type: "expense" | "income" | "both";
          is_default?: boolean;
          sort_order?: number;
        };
        Update: {
          name?: string;
          icon?: string;
          color?: string;
          bg_color?: string;
          type?: "expense" | "income" | "both";
          sort_order?: number;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          category_id: string;
          amount: number;
          type: "expense" | "income" | "transfer";
          date: string;
          note: string;
          tags: string[];
          receipt_url: string | null;
          is_recurring: boolean;
          recurrence_rule: string | null;
          split_group_id: string | null;
          transfer_pair_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          category_id: string;
          amount: number;
          type: "expense" | "income" | "transfer";
          date?: string;
          note?: string;
          tags?: string[];
          receipt_url?: string | null;
          is_recurring?: boolean;
          recurrence_rule?: string | null;
          split_group_id?: string | null;
          transfer_pair_id?: string | null;
        };
        Update: {
          account_id?: string;
          category_id?: string;
          amount?: number;
          type?: "expense" | "income" | "transfer";
          date?: string;
          note?: string;
          tags?: string[];
          receipt_url?: string | null;
          is_recurring?: boolean;
          recurrence_rule?: string | null;
        };
      };
      bills: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          due_day: number | null;
          frequency: "daily" | "weekly" | "monthly" | "yearly" | "one_time";
          account_id: string | null;
          category_id: string | null;
          last_paid_at: string | null;
          next_due_at: string;
          is_active: boolean;
          icon: string;
          reminder_days: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          due_day?: number | null;
          frequency: "daily" | "weekly" | "monthly" | "yearly" | "one_time";
          account_id?: string | null;
          category_id?: string | null;
          next_due_at: string;
          is_active?: boolean;
          icon?: string;
          reminder_days?: number;
        };
        Update: {
          name?: string;
          amount?: number;
          due_day?: number | null;
          frequency?: "daily" | "weekly" | "monthly" | "yearly" | "one_time";
          account_id?: string | null;
          category_id?: string | null;
          last_paid_at?: string | null;
          next_due_at?: string;
          is_active?: boolean;
          icon?: string;
          reminder_days?: number;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string | null;
          upi_id: string | null;
          avatar_url: string | null;
          avatar_color: string;
          net_balance: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone?: string | null;
          upi_id?: string | null;
          avatar_url?: string | null;
          avatar_color?: string;
          net_balance?: number;
        };
        Update: {
          name?: string;
          phone?: string | null;
          upi_id?: string | null;
          avatar_url?: string | null;
          avatar_color?: string;
          net_balance?: number;
        };
      };
      splits: {
        Row: {
          id: string;
          transaction_id: string;
          payer_user_id: string;
          contact_id: string;
          amount: number;
          is_settled: boolean;
          settled_at: string | null;
          settlement_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          transaction_id: string;
          payer_user_id: string;
          contact_id: string;
          amount: number;
          is_settled?: boolean;
          settled_at?: string | null;
          settlement_note?: string | null;
        };
        Update: {
          is_settled?: boolean;
          settled_at?: string | null;
          settlement_note?: string | null;
        };
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string;
          target_amount: number;
          current_amount: number;
          target_date: string;
          monthly_contribution: number;
          color: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          icon?: string;
          target_amount: number;
          current_amount?: number;
          target_date: string;
          monthly_contribution?: number;
          color?: string;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          icon?: string;
          target_amount?: number;
          current_amount?: number;
          target_date?: string;
          monthly_contribution?: number;
          color?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      savings_goal_transactions: {
        Row: {
          id: string;
          goal_id: string;
          amount: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          goal_id: string;
          amount: number;
          note?: string | null;
        };
        Update: never;
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          month: number;
          year: number;
          limit_amount: number;
          rollover: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          month: number;
          year: number;
          limit_amount: number;
          rollover?: boolean;
        };
        Update: {
          limit_amount?: number;
          rollover?: boolean;
        };
      };
      investments: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          name: string;
          buy_price: number;
          units: number;
          buy_date: string;
          current_price: number | null;
          notes: string;
          color: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          name: string;
          buy_price: number;
          units: number;
          buy_date: string;
          current_price?: number | null;
          notes?: string;
          color?: string;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          buy_price?: number;
          units?: number;
          buy_date?: string;
          current_price?: number | null;
          notes?: string;
          color?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      add_transaction_with_split: {
        Args: {
          p_user_id: string;
          p_account_id: string;
          p_category_id: string;
          p_amount: number;
          p_type: string;
          p_date: string;
          p_note: string;
          p_splits?: Json;
        };
        Returns: string;
      };
      settle_contact: {
        Args: {
          p_user_id: string;
          p_contact_id: string;
          p_amount: number;
          p_note?: string;
        };
        Returns: void;
      };
      topup_savings_goal: {
        Args: {
          p_goal_id: string;
          p_user_id: string;
          p_amount: number;
          p_note?: string;
        };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Account = Database["public"]["Tables"]["accounts"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type Bill = Database["public"]["Tables"]["bills"]["Row"];
export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type Split = Database["public"]["Tables"]["splits"]["Row"];
export type SavingsGoal = Database["public"]["Tables"]["savings_goals"]["Row"];
export type SavingsGoalTransaction = Database["public"]["Tables"]["savings_goal_transactions"]["Row"];
export type Budget = Database["public"]["Tables"]["budgets"]["Row"];
export type Investment = Database["public"]["Tables"]["investments"]["Row"];

// Extended types for UI
export type TransactionWithCategory = Transaction & {
  category: Category | null;
  account: Account | null;
};

export type BillWithStatus = Bill & {
  status: "overdue" | "due_soon" | "upcoming" | "paid";
};

export type GoalWithProgress = SavingsGoal & {
  progress_percent: number;
  days_remaining: number;
  status: "on_track" | "falling_behind" | "completed";
};

export type BudgetWithSpent = Budget & {
  category: Category | null;
  spent_amount: number;
  progress_percent: number;
};
