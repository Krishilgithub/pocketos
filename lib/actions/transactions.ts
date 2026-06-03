"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getTransactions(options?: {
  type?: "expense" | "income" | "transfer";
  limit?: number;
  month?: number;
  year?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("transactions")
    .select(`
      *,
      category:categories(*),
      account:accounts(*)
    `)
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (options?.type) {
    query = query.eq("type", options.type);
  }

  if (options?.month && options?.year) {
    const start = new Date(options.year, options.month - 1, 1).toISOString();
    const end = new Date(options.year, options.month, 0, 23, 59, 59).toISOString();
    query = query.gte("date", start).lte("date", end);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) { console.error("getTransactions:", error); return []; }
  return (data || []) as any;
}

export async function addTransaction(formData: {
  account_id: string;
  category_id: string;
  amount: number;
  type: "expense" | "income";
  date: string;
  note: string;
  splits?: { contact_id: string; amount: number }[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await (supabase.rpc as any)("add_transaction_with_split", {
    p_user_id: user.id,
    p_account_id: formData.account_id,
    p_category_id: formData.category_id,
    p_amount: formData.amount,
    p_type: formData.type,
    p_date: formData.date,
    p_note: formData.note,
    p_splits: formData.splits ? JSON.stringify(formData.splits) : null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
  revalidatePath("/reports");

  return { success: true, id: data };
}

export async function deleteTransaction(transactionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get tx details first for balance reversal
  const { data: tx } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .eq("user_id", user.id)
    .single();

  if (!tx) return { error: "Transaction not found" };

  // Reverse balance
  const txAny = tx as any;
  const balanceChange = txAny.type === "income" ? -txAny.amount : txAny.amount;
  await supabase
    .from("accounts")
    // @ts-ignore
    .update({ balance: supabase.raw(`balance + ${balanceChange}`) as any } as any)
    .eq("id", txAny.account_id);

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { success: true };
}

export async function getMonthlyStats(month?: number, year?: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { income: 0, expense: 0, net: 0 };

  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const start = new Date(y, m - 1, 1).toISOString();
  const end = new Date(y, m, 0, 23, 59, 59).toISOString();

  const { data } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", user.id)
    .gte("date", start)
    .lte("date", end);

  const income = (data || []).filter((t: any) => t.type === "income").reduce((s: number, t: any) => s + Number(t.amount), 0);
  const expense = (data || []).filter((t: any) => t.type === "expense").reduce((s: number, t: any) => s + Number(t.amount), 0);

  return { income, expense, net: income - expense };
}
