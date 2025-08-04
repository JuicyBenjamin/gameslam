// TODO: Migrate from Qwik component$ to React functional component
// TODO: Replace Slot with React children prop

// Original Qwik code (commented out for reference):
// import { component$, Slot } from "@builder.io/qwik";
// import { Footer } from "../footer";
// import { Header } from "../header";

// export default component$(() => {
//   return (
//     <>
//       <Header />
//       <main class="contaier flex min-h-[80vh] flex-col justify-start gap-4 ">
//         <Slot />
//       </main>
//       <Footer />
//     </>
//   );
// });

import React from 'react';
import { Footer } from "../footer";
import { Header } from "../header";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <Header />
      <main className="contaier flex min-h-[80vh] flex-col justify-start gap-4 ">
        {children}
      </main>
      <Footer />
    </>
  );
}