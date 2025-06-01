import type { RequestEventLoader } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { supabaseClient } from "~/lib/supabase";
import { getUserById } from "~/db/queries/users";

// eslint-disable-next-line qwik/loader-location
export const useRedirectIfLoggedIn = routeLoader$(
  async (requestEvent: RequestEventLoader) => {
    const supabase = supabaseClient(requestEvent);
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      throw requestEvent.redirect(302, "/");
    }
  },
);

// eslint-disable-next-line qwik/loader-location
export const useCurrentUser = routeLoader$(
  async (requestEvent: RequestEventLoader) => {
    // Try to get user from sharedMap first
    const user = requestEvent.sharedMap.get("user");
    if (user) {
      const userData = await getUserById(user.id);
      return userData;
    }

    // Fallback to checking session if user not in sharedMap
    const supabase = supabaseClient(requestEvent);
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    const userData = await getUserById(data.user.id);
    return userData;
  },
);
