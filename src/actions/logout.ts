// TODO: Migrate from Qwik globalAction$ to TanStack Router action pattern
// TODO: Replace requestEvent with TanStack Router context
// TODO: Implement proper redirect handling for TanStack Router

import { supabaseClient } from "~/lib/supabase";

// Original Qwik code (commented out for reference):
// import { globalAction$ } from "@builder.io/qwik-city";

// export const useLogout = globalAction$(async (_, requestEvent) => {
//   const supabase = supabaseClient(requestEvent);

//   // Sign out and clear session
//   const { error } = await supabase.auth.signOut();

//   if (error) {
//     console.error("Logout error:", error);
//   }

//   // Redirect to home page
//   throw requestEvent.redirect(302, "/");
// });

// TODO: Implement TanStack Router equivalent action
export const logout = async (context: any) => {
  const supabase = supabaseClient(context);

  // Sign out and clear session
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
  }

  // TODO: Use TanStack Router redirect
  throw new Error("Redirect to /");
};