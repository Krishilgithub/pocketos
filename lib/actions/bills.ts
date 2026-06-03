"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getBills() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bills")
    .select("*, category:categories(*), account:accounts(*)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("next_due_at", { ascending: true });

  if (error) return [];

  const now = new Date();
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  return (data || []).map((bill: any) => {
    const dueDate = new Date(bill.next_due_at);
    let status: "overdue" | "due_soon" | "upcoming";
    if (dueDate < now) status = "overdue";
    else if (dueDate <= in3Days) status = "due_soon";
    else status = "upcoming";
    return { ...bill, status } as any;
  });
}

export async function createBill(billData: {
  name: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly" | "one_time";
  next_due_at: string;
  due_day?: number;
  account_id?: string;
  category_id?: string;
  icon?: string;
  reminder_days?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await (supabase.from("bills") as any).insert({
    user_id: user.id,
    ...billData,
  });

  if (error) return { error: error.message };
  revalidatePath("/bills");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markBillPaid(billId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await (supabase.rpc as any)("mark_bill_paid", {
    p_bill_id: billId,
    p_user_id: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/bills");
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { success: true, transaction_id: data };
}

export async function deleteBill(billId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("bills")
    // @ts-ignore
    .update({ is_active: false })
    .eq("id", billId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/bills");
  return { success: true };
}
