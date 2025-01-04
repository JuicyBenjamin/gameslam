import type { RequestEventLoader } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { supabaseClient } from "~/lib/supabase";

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
export const useIsUserLoggedIn = routeLoader$(
  async (requestEvent: RequestEventLoader) => {
    const supabase = supabaseClient(requestEvent);
    const { data } = await supabase.auth.getUser();
    requestEvent.cacheControl({ noCache: true });
    return data.user != null;
  },
);
