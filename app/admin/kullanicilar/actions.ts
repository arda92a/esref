"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createAdminUser(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Bu işlem için giriş yapmanız gerekiyor." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-posta ve şifre zorunludur." };
  }
  if (password.length < 6) {
    return { error: "Şifre en az 6 karakter olmalıdır." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    return { error: (err as Error).message };
  }

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/kullanicilar");
  return { success: `${email} kullanıcısı oluşturuldu.` };
}

export async function deleteAdminUser(userId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Bu işlem için giriş yapmanız gerekiyor.");
  }
  if (user.id === userId) {
    throw new Error("Kendi hesabınızı silemezsiniz.");
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/kullanicilar");
}
