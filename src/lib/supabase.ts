import { createServerClient } from '@supabase/ssr';
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
        // Transform the cookies into the expected format
        return Object.entries(cookies).map(([name, value]) => ({
          name,
          value: value.value, // Ensure the value is a string
        }));
      },
      setAll(cookiesToSet) {
        console.log("Setting cookies:", cookiesToSet); // Log the cookies before setting them
        cookiesToSet.forEach(({ name, value, options }) => {
          requestEv.cookie.set(name, value, options);
        });
      }
    },
  });
};
