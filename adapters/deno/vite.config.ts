import { denoServerAdapter } from "@builder.io/qwik-city/adapters/deno-server/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config.ts";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.deno.ts", "@qwik-city-plan"],
      },
      noExternal: ["@qwik-city-plan", "@qwik-client-manifest"],
      minify: false,
    },
    plugins: [
      denoServerAdapter({
        // ssg: {
        //   include: ["/*"],
        //   origin: "https://yoursite.dev",
        // },
      }),
    ],
  };
});
