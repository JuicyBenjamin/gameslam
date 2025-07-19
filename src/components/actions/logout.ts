import { routeAction$ } from "@builder.io/qwik-city";
import { supabaseClient } from "~/lib/supabase";

// eslint-disable-next-line
export const useLogout = routeAction$(async (_, requestEvent) => {
  const supabase = supabaseClient(requestEvent);
  await supabase.auth.signOut();
  throw requestEvent.redirect(302, "/");
});
