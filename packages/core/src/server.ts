import fs from "node:fs/promises";
import type { ResumeData } from "./types.js";
import { renderResumeHtml } from "./renderer.js";

export async function buildHtml(resumeData: ResumeData) {
  const templateUrl = new URL("../templates/ats.html", import.meta.url);
  const cssUrl = new URL("../templates/style.css", import.meta.url);

  const templateHtml = await fs.readFile(templateUrl, "utf-8");
  const css = await fs.readFile(cssUrl, "utf-8");

  return renderResumeHtml(resumeData, templateHtml, css);
}
