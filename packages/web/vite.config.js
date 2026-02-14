import { defineConfig } from "vite";
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
function atsResumePlugin() {
    const coreDir = resolve(__dirname, "../core");
    return {
        name: "ats-resume",
        configureServer(server) {
            // Serve core static assets (templates + example data)
            server.middlewares.use((req, res, next) => {
                if (!req.url)
                    return next();
                if (req.url.startsWith("/templates/") || req.url.startsWith("/data/")) {
                    const filePath = resolve(coreDir, `.${req.url}`);
                    try {
                        const content = readFileSync(filePath, "utf-8");
                        const ext = req.url.split(".").pop();
                        const mime = {
                            html: "text/html",
                            css: "text/css",
                            json: "application/json",
                        };
                        res.setHeader("Content-Type", mime[ext ?? ""] ?? "text/plain");
                        res.end(content);
                        return;
                    }
                    catch {
                        // file not found — fall through
                    }
                }
                next();
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
});
