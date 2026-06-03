"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getSavingsGoals() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as any;
}

export async function getSavingsGoalById(goalId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: goal } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("id", goalId)
    .eq("user_id", user.id)
    .single();

  if (!goal) return null;

  const { data: transactions } = await supabase
    .from("savings_goal_transactions")
    .select("*")
    .eq("goal_id", goalId)
    .order("created_at", { ascending: false })
    .limit(10);

  return { goal: goal as any, transactions: (transactions || []) as any };
}

export async function createSavingsGoal(goalData: {
  name: string;
  icon?: string;
  target_amount: number;
  target_date: string;
  monthly_contribution?: number;
  color?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await (supabase.from("savings_goals") as any).insert({
    user_id: user.id,
    ...goalData,
  });

  if (error) return { error: error.message };
  revalidatePath("/savings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function topupSavingsGoal(
  goalId: string,
  amount: number,
  note = "Top up"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await (supabase.rpc as any)("topup_savings_goal", {
    p_goal_id: goalId,
    p_user_id: user.id,
    p_amount: amount,
    p_note: note,
  });

  if (error) return { error: error.message };
  revalidatePath(`/savings/${goalId}`);
  revalidatePath("/savings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteSavingsGoal(goalId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("savings_goals")
    // @ts-ignore
    .update({ is_active: false } as any)
    .eq("id", goalId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/savings");
  return { success: true };
}
