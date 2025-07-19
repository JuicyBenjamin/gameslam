import { defineConfig } from "vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return defineConfig({
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.node.tsx", "@qwik-router-config"],
      },
      outDir: "server",
    },
    plugins: [],
  });
});