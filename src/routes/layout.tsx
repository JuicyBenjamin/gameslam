// TODO: Migrate from Qwik component$ to React functional component
// TODO: Replace Qwik RequestHandler with TanStack Router equivalent
// TODO: Replace Slot with React children prop

// Original Qwik code (commented out for reference):
// import { component$, Slot } from "@builder.io/qwik";
// import type { RequestHandler } from "@builder.io/qwik-city";
// import RootLayout from "~/components/layouts/root-layout";

// export { useCurrentUser } from "~/loaders/auth";

// export const onGet: RequestHandler = async ({ cacheControl }) => {
//   // Control caching for this request for best performance and to reduce hosting costs:
//   // https://qwik.dev/docs/caching/
//   cacheControl({
//     // Always serve a cached response by default, up to a week stale
//     staleWhileRevalidate: 60 * 60 * 24 * 7,
//     // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
//     maxAge: 5,
//   });
// };

// export default component$(() => {
//   return (
//     <RootLayout>
//       <Slot />
//     </RootLayout>
//   );
// });

import React from 'react';
import RootLayout from "~/components/layouts/root-layout";

// TODO: Export TanStack Router equivalent of useCurrentUser
// export { useCurrentUser } from "~/loaders/auth";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <RootLayout>
      {children}
    </RootLayout>
  );
}