import type { RequestHandler } from "@builder.io/qwik-city";
import type { EmailOtpType } from "~/lib/supabase";
import { supabaseClient } from "~/lib/supabase";

export const onGet: RequestHandler = async (requestEvent) => {
  const token_hash = requestEvent.query.get("token_hash");
  const type = requestEvent.query.get("type") as EmailOtpType;
  const next = requestEvent.query.get("next") ?? "/";

  const supabase = supabaseClient(requestEvent);

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      throw requestEvent.redirect(302, next);
    }
  }

  // await supabase.auth.signOut();
  throw requestEvent.redirect(302, "/auth/auth-code-error");
};
