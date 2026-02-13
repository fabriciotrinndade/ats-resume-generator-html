import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { readFileSync } from "fs";

/**
 * Vite plugin that:
 * 1. Serves /templates/* and /data/* from packages/core at dev time.
 * 2. Exposes POST /api/export-pdf — receives ResumeData JSON,
 *    renders HTML with the core renderer, and returns a PDF via Playwright.
 */
function atsResumePlugin(): Plugin {
  const coreDir = resolve(__dirname, "../core");

  return {
    name: "ats-resume",
    configureServer(server) {
      // Serve core static assets (templates + example data)
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        if (req.url.startsWith("/templates/") || req.url.startsWith("/data/")) {
          const filePath = resolve(coreDir, `.${req.url}`);
          try {
            const content = readFileSync(filePath, "utf-8");
            const ext = req.url.split(".").pop();
            const mime: Record<string, string> = {
              html: "text/html",
              css: "text/css",
              json: "application/json",
            };
            res.setHeader("Content-Type", mime[ext ?? ""] ?? "text/plain");
            res.end(content);
            return;
          } catch {
            // file not found — fall through
          }
        }
        next();
      });

      // PDF export endpoint
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== "/api/export-pdf" || req.method !== "POST") return next();

        let body = "";
        req.on("data", (chunk: Buffer) => (body += chunk.toString()));
        req.on("end", async () => {
          try {
            // Dynamic imports from file paths to avoid Vite bundling Playwright
            const { renderResumeHtml } = await import(
              resolve(coreDir, "src/renderer.ts")
            );
            const { exportPdf } = await import(
              resolve(coreDir, "src/pdf-exporter.ts")
            );

            const data = JSON.parse(body);
            const templateHtml = readFileSync(resolve(coreDir, "templates/ats.html"), "utf-8");
            const css = readFileSync(resolve(coreDir, "templates/style.css"), "utf-8");
            const html = renderResumeHtml(data, templateHtml, css);
            const pdfBuffer = await exportPdf(html);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
            res.end(pdfBuffer);
          } catch (err: any) {
            console.error("PDF export error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), atsResumePlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["@ats-resume/core", "playwright"],
  },
  ssr: {
    noExternal: [],
  },
});
