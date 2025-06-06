import { createServerClient, createBrowserClient } from '@supabase/ssr';
import type { RequestEvent, RequestEventAction } from '@builder.io/qwik-city';

export type MobileOtpType = 'sms' | 'phone_change'
export type EmailOtpType = 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email'

export const supabaseClient = (requestEv: RequestEvent | RequestEventAction) => {
  const supabaseUrl = requestEv.env.get("SUPABASE_URL");
  const supabaseAnonKey = requestEv.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookies = requestEv.cookie.getAll();
        return Object.keys(cookies).map((name) => {
          return { name, value: cookies[name].value };
        });
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((cookie) => {
          requestEv.cookie.set(cookie.name, cookie.value, cookie.options);
        });
      }
    },
  });
};