import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

/**
 * Dev-only plugin:
 * serve templates/data from packages/core while running `vite dev`.
 * In production we serve from /public (copied to dist).
 */
function atsResumeDevAssetsPlugin() {
  const coreDir = resolve(__dirname, "../core");
  return {
    name: "ats-resume-dev-assets",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        if (req.url.startsWith("/templates/") || req.url.startsWith("/data/")) {
          const filePath = resolve(coreDir, `.${req.url}`);
          try {
            const content = readFileSync(filePath, "utf-8");
            const ext = req.url.split(".").pop()?.toLowerCase();
            const mime = {
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
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), atsResumeDevAssetsPlugin()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom"],
    },
  };
});
