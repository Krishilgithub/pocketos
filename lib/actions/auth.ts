"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signUpWithPIN(fullName: string, email: string, pin: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pin + "-pocketos",
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    const encoder = new TextEncoder();
    const hashData = encoder.encode(pin + data.user!.id);
    const hashBuffer = await crypto.subtle.digest("SHA-256", hashData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const pin_hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    await supabase
      .from("profiles")
      // @ts-ignore
      .update({ pin_hash, pin_enabled: true })
      .eq("id", data.user!.id);
  } else {
    return { error: "Please check your email to confirm your account." };
  }

  return { success: true };
}

export async function signInWithPIN(email: string, pin: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: pin + "-pocketos",
  });

  if (error) {
    return { error: "Invalid PIN or Email" };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/signin");
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile as any;
}

export async function updateProfile(updates: {
  full_name?: string;
  currency?: string;
  theme?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    // @ts-ignore
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function setPIN(pin: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Simple hash using crypto — in production use bcryptjs on server
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + user.id);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const pin_hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  const { error } = await supabase
    .from("profiles")
    // @ts-ignore
    .update({ pin_hash, pin_enabled: true, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };

  // Set the PIN as the user's auth password for faster future logins
  const { error: pwError } = await supabase.auth.updateUser({
    password: pin + "-pocketos"
  });
  
  if (pwError) return { error: pwError.message };

  return { success: true };
}

export async function verifyPIN(pin: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("pin_hash, pin_enabled")
    .eq("id", user.id)
    .single();

  if (!(profile as any)?.pin_enabled || !(profile as any)?.pin_hash) return true; // No PIN set

  const encoder = new TextEncoder();
  const data = encoder.encode(pin + user.id);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const inputHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return inputHash === (profile as any)?.pin_hash;
}
