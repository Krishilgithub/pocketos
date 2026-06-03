"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getAccounts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  if (error) return [];
  return (data || []) as any;
}

export async function createAccount(accountData: {
  name: string;
  type: "cash" | "bank" | "upi" | "credit";
  balance?: number;
  color?: string;
  icon?: string;
  last_four?: string;
  credit_limit?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await (supabase.from("accounts") as any).insert({
    user_id: user.id,
    ...accountData,
  });

  if (error) return { error: error.message };
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function transferBetweenAccounts(
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  note = "Transfer"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await (supabase.rpc as any)("transfer_between_accounts", {
    p_user_id: user.id,
    p_from_account_id: fromAccountId,
    p_to_account_id: toAccountId,
    p_amount: amount,
    p_note: note,
  });

  if (error) return { error: error.message };
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getTotalBalance() {
  const accounts = await getAccounts();
  return accounts.reduce((sum: number, acc: any) => sum + Number(acc.balance), 0);
}
