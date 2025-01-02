import type { RequestHandler } from "@builder.io/qwik-city";
import { supabaseClient } from "~/lib/supabase";

export const onGet: RequestHandler = async (requestEvent) => {
  const supabase = supabaseClient(requestEvent);
  await supabase.auth.signOut();
  throw requestEvent.redirect(302, "/");
};
