import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const port = Number(process.env.PORT || 3000);
const basePath = process.env.BASE_PATH || "/";

const optionalPlugins = [];

if (
  process.env.NODE_ENV !== "production" &&
  process.env.REPL_ID !== undefined
) {
  try {
    const cartographer = await import("@replit/vite-plugin-cartographer");

    optionalPlugins.push(
      cartographer.cartographer({
        root: path.resolve(import.meta.dirname, ".."),
      })
    );
  } catch {
    // optional plugin
  }

  try {
    const banner = await import("@replit/vite-plugin-dev-banner");

    optionalPlugins.push(
      banner.devBanner()
    );
  } catch {
    // optional plugin
  }
}

export default defineConfig({
  base: basePath,

  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...optionalPlugins,
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "attached_assets"
      ),
    },
    dedupe: ["react", "react-dom"],
  },

  root: path.resolve(import.meta.dirname),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },

  server: {
    host: "0.0.0.0",
    port,
    strictPort: true,

    fs: {
      strict: false,
    },

    allowedHosts: true,
  },

  preview: {
    host: "0.0.0.0",
    port,
    allowedHosts: true,
  },
});
