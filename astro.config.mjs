import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel/serverless";
import clerk from "@clerk/astro";
import { visualizer } from "rollup-plugin-visualizer";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    clerk({
      afterSignInUrl: "/",
      afterSignUpUrl: "/",
    }),
  ],
  vite: {
    plugins: [
      visualizer({
        template: "treemap",
        open: process.env.ANALYZE === "true",
        gzipSize: true,
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("clerk-js")) {
              return "@clerk-js";
            }

            if (id.includes("astro-clerk-auth")) {
              return "@astro-clerk-auth";
            }

            if (id.includes("localizations")) {
              return "@clerk-localizations";
            }
          },
        },
      },
    },
  },
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    speedInsights: {
      enabled: true,
    },
  }),
});
