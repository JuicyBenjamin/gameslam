import type { RequestEventLoader } from "@qwik.dev/router";
import { routeLoader$ } from "@qwik.dev/router";
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
    requestEvent.cacheControl({
      private: true,
    });

    const supabase = supabaseClient(requestEvent);
    const { data } = await supabase.auth.getUser();

    if (!data.user) return null;
    const userData = await getUserById(data.user.id);
    return userData;
  },
);
