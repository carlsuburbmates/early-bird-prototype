import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tanstackStart({
      srcDirectory: "src",
      router: {
        generatedRouteTree: "routeTree.gen.ts",
      },
      server: {
        entry: "server",
      },
    }),
    // React's Vite plugin must come after TanStack Start's Vite plugin.
    viteReact(),
    tailwindcss(),
  ],
});
