"use server";

import { createClient } from "@/lib/supabase/server";
import {
  subscribeSchema,
  contactSchema,
  type SubscribeInput,
  type ContactInput,
} from "./schemas";

export async function subscribeToNewsletter(input: SubscribeInput) {
  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("leads").insert({
    email: parsed.data.email,
    name: parsed.data.name,
    source: "newsletter",
    locale: parsed.data.locale,
  });

  if (error) {
    // unique constraint violation = ya estaba suscrito, lo tratamos como éxito silencioso
    if (error.code === "23505") {
      return { ok: true as const, alreadySubscribed: true };
    }
    console.error("[newsletter] insert error:", error);
    return {
      ok: false as const,
      error: { _form: ["No pudimos suscribirte. Intenta de nuevo."] },
    };
  }

  return { ok: true as const, alreadySubscribed: false };
}

export async function submitContactForm(input: ContactInput) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("leads").insert({
    email: parsed.data.email,
    name: parsed.data.name,
    phone: parsed.data.phone,
    message: parsed.data.message,
    source: "contact",
    locale: parsed.data.locale,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: true as const, duplicate: true };
    }
    console.error("[contact] insert error:", error);
    return {
      ok: false as const,
      error: { _form: ["No pudimos enviar tu mensaje. Intenta de nuevo."] },
    };
  }

  return { ok: true as const, duplicate: false };
}
