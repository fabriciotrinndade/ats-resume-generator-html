// packages/web/vite.config.ts
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { readFileSync } from "fs";

/**
 * Dev-only plugin:
 * - Serves /templates/* and /data/* from packages/core during `vite dev`
 */
function atsResumeDevAssetsPlugin(): Plugin {
  const coreDir = resolve(__dirname, "../core");

  return {
    name: "ats-resume-dev-assets",
    apply: "serve", // IMPORTANT: do not run on `vite build`
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        if (req.url.startsWith("/templates/") || req.url.startsWith("/data/")) {
          const filePath = resolve(coreDir, `.${req.url}`);
          try {
            const content = readFileSync(filePath, "utf-8");
            const ext = req.url.split(".").pop()?.toLowerCase();
            const mime: Record<string, string> = {
              html: "text/html; charset=utf-8",
              css: "text/css; charset=utf-8",
              json: "application/json; charset=utf-8",
            };

            res.setHeader(
              "Content-Type",
              mime[ext ?? ""] ?? "text/plain; charset=utf-8",
            );
            res.end(content);
            return;
          } catch {
            // fall through
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), atsResumeDevAssetsPlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@ats-resume/core": resolve(__dirname, "../core/src/index.ts"),
      "@ats-resume/core/": resolve(__dirname, "../core/src/"),
    },
  },
});
