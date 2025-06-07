"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function createUser(formData: FormData) {
  const supabase = await createClient();
  const phone = formData.get("phone") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = (formData.get("lastName") as string) || null;

  const { data, error } = await supabase.auth.admin.createUser({
    phone: phone,
  });

  if (data.user?.id) {
    const { data: userProfile, error: insertError } = await supabase
      .from("user_profiles")
      .insert({
        user_id: data.user.id,
        phone_number: phone,
        first_name: firstName,
        last_name: lastName,
      })
      .select("id")
      .single();

    let normalizedPhone = phone.trim().replace(/[^+\d]/g, "");
    if (!normalizedPhone.startsWith("+")) {
      // Assume US number if no country code
      normalizedPhone = "+1" + normalizedPhone;
    }
    const phoneHash = await bcrypt.hash(normalizedPhone, 10);

    const { error: phoneError } = await supabase
      .from("phones")
      .insert({
        user_profile_id: userProfile?.id!,
        phone_hash: phoneHash,
      })
      .select();

    if (insertError || phoneError) {
      console.error("Error inserting user:", insertError);
    }
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function getAllUsers() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return { users: [], error: error.message };
    }

    return { users: data || [], error: null };
  } catch (error) {
    console.error("Unexpected error fetching users:", error);
    return { users: [], error: "An unexpected error occurred" };
  }
}
