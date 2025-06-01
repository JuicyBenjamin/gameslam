import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import RootLayout from "~/components/layouts/root-layout";
import { supabaseClient } from "~/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { getUserById } from "~/db/queries/users";
import CreateAccount from "~/components/features/create-account";

export { useCurrentUser } from "~/loaders/auth";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

// Redirect to login page if user is not logged in
export const onRequest: RequestHandler<string> = async (requestEvent) => {
  const supabase = supabaseClient(requestEvent);
  const { data } = await supabase.auth.getUser();
  if (data.user == null) {
    throw requestEvent.redirect(302, "/login");
  }
  requestEvent.sharedMap.set("user", data.user);
};

export const useIsUserCreated = routeLoader$(async (requestEvent) => {
  const user = requestEvent.sharedMap.get("user") as User;
  const userData = await getUserById(user.id);
  return userData != null;
});

export default component$(() => {
  const isUserCreated = useIsUserCreated();
  return (
    <RootLayout>
      {isUserCreated.value ? <Slot /> : <CreateAccount />}
    </RootLayout>
  );
});
