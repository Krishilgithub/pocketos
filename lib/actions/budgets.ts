"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getBudgets(month?: number, year?: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const { data: budgets, error } = await supabase
    .from("budgets")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .eq("month", m)
    .eq("year", y);

  if (error) return [];

  // Calculate spent per category this month
  const start = new Date(y, m - 1, 1).toISOString();
  const end = new Date(y, m, 0, 23, 59, 59).toISOString();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("category_id, amount")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("date", start)
    .lte("date", end);

  const spentByCategory: Record<string, number> = {};
  (transactions || []).forEach((tx: any) => {
    spentByCategory[tx.category_id] = (spentByCategory[tx.category_id] || 0) + Number(tx.amount);
  });

  return (budgets || []).map((budget: any) => ({
    ...budget,
    spent_amount: spentByCategory[budget.category_id] || 0,
    progress_percent: Math.round(
      ((spentByCategory[budget.category_id] || 0) / budget.limit_amount) * 100
    ),
  })) as any;
}

export async function createBudget(budgetData: {
  category_id: string;
  limit_amount: number;
  month?: number;
  year?: number;
  rollover?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const now = new Date();

  const { error } = await (supabase.from("budgets") as any).upsert({
    user_id: user.id,
    month: budgetData.month ?? now.getMonth() + 1,
    year: budgetData.year ?? now.getFullYear(),
    ...budgetData,
  }, { onConflict: "user_id,category_id,month,year" });

  if (error) return { error: error.message };
  revalidatePath("/budgets");
  return { success: true };
}

export async function getCategories(type?: "expense" | "income" | "both") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("categories")
    .select("*")
    .or(`user_id.eq.${user.id},user_id.is.null`)
    .order("sort_order", { ascending: true });

  if (type) {
    query = query.in("type", [type, "both"]);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data || []) as any;
}
