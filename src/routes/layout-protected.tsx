// TODO: Migrate from Qwik component$ to React functional component
// TODO: Replace Qwik routeLoader$ with TanStack Router loader
// TODO: Replace Qwik RequestHandler with TanStack Router equivalent
// TODO: Replace Slot with React children prop

// Original Qwik code (commented out for reference):
// import { component$, Slot } from "@builder.io/qwik";
// import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
// import RootLayout from "~/components/layouts/root-layout";
// import { supabaseClient } from "~/lib/supabase";
// import { getUserById } from "~/db/queries/users";
// import CreateAccount from "~/components/features/create-account";

// export { useCurrentUser } from "~/loaders/auth";

// // Redirect to login page if user is not logged in
// export const onRequest: RequestHandler<string> = async (requestEvent) => {
//   const supabase = supabaseClient(requestEvent);
//   const { data } = await supabase.auth.getSession();
//   if (!data.session?.user) {
//     throw requestEvent.redirect(302, "/login");
//   }
// };

// export const useIsUserCreated = routeLoader$(async (requestEvent) => {
//   const supabase = supabaseClient(requestEvent);
//   const { data } = await supabase.auth.getSession();

//   if (!data.session?.user) return false;

//   const userData = await getUserById(data.session.user.id);
//   return userData != null;
// });

// export default component$(() => {
//   const isUserCreated = useIsUserCreated();

//   return (
//     <RootLayout>
//       {isUserCreated.value ? <Slot /> : <CreateAccount />}
//     </RootLayout>
//   );
// });

import React from 'react';
import RootLayout from "~/components/layouts/root-layout";
import CreateAccount from "~/components/features/create-account";

// TODO: Export TanStack Router equivalent of useCurrentUser
// export { useCurrentUser } from "~/loaders/auth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  // TODO: Replace with TanStack Router loader
  // const isUserCreated = useIsUserCreated();
  const isUserCreated = false; // Mock for now

  return (
    <RootLayout>
      {isUserCreated ? children : <CreateAccount />}
    </RootLayout>
  );
}