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
    // Set cache control headers
    requestEvent.cacheControl({
      // Cache for 5 minutes
      maxAge: 300,
      // Allow stale responses for up to 1 hour
      staleWhileRevalidate: 3600,
      private: true,
    });

    const supabase = supabaseClient(requestEvent);
    const { data } = await supabase.auth.getUser();

    if (!data.user) return null;
    const userData = await getUserById(data.user.id);
    return userData;
  },
);
