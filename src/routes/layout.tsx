import { component$, Slot, useTask$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import RootLayout from "~/components/layouts/root-layout";
import { useCurrentUser } from "~/loaders/auth";
import { useContext } from "@builder.io/qwik";
import { UserContext } from "~/contexts/user-context";

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

export default component$(() => {
  const currentUser = useCurrentUser();
  const store = useContext(UserContext);

  useTask$(({ track }) => {
    track(() => currentUser.value);
    store.user = currentUser.value;
  });

  return (
    <RootLayout>
      <Slot />
    </RootLayout>
  );
});
