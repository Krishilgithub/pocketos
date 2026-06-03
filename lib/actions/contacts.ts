"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getContacts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) return [];
  return (data || []) as any;
}

export async function createContact(contactData: {
  name: string;
  phone?: string;
  upi_id?: string;
  avatar_color?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await (supabase.from("contacts") as any).insert({
    user_id: user.id,
    ...contactData,
  });

  if (error) return { error: error.message };
  revalidatePath("/contacts");
  return { success: true };
}

export async function settleContact(
  contactId: string,
  amount: number,
  note = ""
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await (supabase.rpc as any)("settle_contact", {
    p_user_id: user.id,
    p_contact_id: contactId,
    p_amount: amount,
    p_note: note,
  });

  if (error) return { error: error.message };
  revalidatePath("/contacts");
  return { success: true };
}

export async function getContactSplits(contactId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("splits")
    .select("*, transaction:transactions(*)")
    .eq("contact_id", contactId)
    .eq("payer_user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as any;
}
