import { component$, Slot } from "@builder.io/qwik";
import { Footer } from "../footer";
import { Header } from "../header";

export default component$(() => {
  return (
    <>
      <Header />
      <main class="contaier flex min-h-[80vh] flex-col justify-start gap-4 ">
        <Slot />
      </main>
      <Footer />
    </>
  );
});
