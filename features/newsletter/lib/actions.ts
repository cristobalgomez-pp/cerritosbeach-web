"use server";

import { createClient } from "@/lib/supabase/server";
import {
  subscribeSchema,
  contactSchema,
  type SubscribeInput,
  type ContactInput,
} from "./schemas";

export type FormFieldErrors = {
  _form?: string[];
  email?: string[];
  name?: string[];
  phone?: string[];
  message?: string[];
  locale?: string[];
};

type SubscribeResult =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; error: FormFieldErrors };

type ContactResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; error: FormFieldErrors };

export async function subscribeToNewsletter(
  input: SubscribeInput
): Promise<SubscribeResult> {
  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.flatten().fieldErrors as FormFieldErrors,
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
    if (error.code === "23505") {
      return { ok: true, alreadySubscribed: true };
    }
    console.error("[newsletter] insert error:", error);
    return {
      ok: false,
      error: { _form: ["No pudimos suscribirte. Intenta de nuevo."] },
    };
  }

  return { ok: true, alreadySubscribed: false };
}

export async function submitContactForm(
  input: ContactInput
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.flatten().fieldErrors as FormFieldErrors,
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
      return { ok: true, duplicate: true };
    }
    console.error("[contact] insert error:", error);
    return {
      ok: false,
      error: { _form: ["No pudimos enviar tu mensaje. Intenta de nuevo."] },
    };
  }

  return { ok: true, duplicate: false };
}
