// TODO: Migrate from Qwik routeLoader$ to TanStack Router loader pattern
// TODO: Replace RequestEventLoader with TanStack Router context
// TODO: Implement proper caching strategy for TanStack Router

import { getSupabaseServerClient } from "~/utils/supabase";
import { getUserById } from "~/db/queries/users";

// Original Qwik code (commented out for reference):
// import type { RequestEventLoader } from "@builder.io/qwik-city";
// import { routeLoader$ } from "@builder.io/qwik-city";

// export const useRedirectIfLoggedIn = routeLoader$(
//   async (requestEvent: RequestEventLoader) => {
//     const supabase = supabaseClient(requestEvent);
//     const { data } = await supabase.auth.getUser();
//     if (data.user) {
//       throw requestEvent.redirect(302, "/");
//     }
//   },
// );

// export const useCurrentUser = routeLoader$(
//   async (requestEvent: RequestEventLoader) => {
//     // Set cache control to 0 to prevent caching
//     requestEvent.cacheControl({
//       maxAge: 0,
//     });

//     const supabase = supabaseClient(requestEvent);
//     const { data } = await supabase.auth.getUser();

//     if (!data.user) {
//       return null;
//     }

//     // Fetch the full user data from the database
//     const userData = await getUserById(data.user.id);

//     if (!userData) {
//       // User exists in Supabase but not in database - incomplete profile
//       return { incompleteProfile: true };
//     }

//     return userData;
//   },
// );

// TODO: Implement TanStack Router equivalent loaders
export const redirectIfLoggedIn = async (context: any) => {
  // TODO: Implement TanStack Router redirect logic
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    // TODO: Use TanStack Router redirect
    throw new Error("Redirect to /");
  }
};

export const getCurrentUser = async () => {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return null;
  }

  // Fetch the full user data from the database
  const userData = await getUserById(data.user.id);

  if (!userData) {
    // User exists in Supabase but not in database - incomplete profile
    return { incompleteProfile: true };
  }

  return userData;
};