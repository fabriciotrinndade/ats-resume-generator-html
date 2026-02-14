import { useEffect, useState } from "react";
import type { ResumeData } from "@ats-resume/core";
import { renderResumeHtml } from "@ats-resume/core";

let _templateHtml = "";
let _css = "";

async function loadAssets() {
  if (_templateHtml && _css) return;

  const [tplRes, cssRes] = await Promise.all([
    fetch("/templates/ats.html", { cache: "no-store" }),
    fetch("/templates/style.css", { cache: "no-store" }),
  ]);

  if (!tplRes.ok) throw new Error(`ats.html fetch failed: ${tplRes.status}`);
  if (!cssRes.ok) throw new Error(`style.css fetch failed: ${cssRes.status}`);

  const [tpl, css] = await Promise.all([tplRes.text(), cssRes.text()]);

  // evita cachear HTML errado (ex: index.html de SPA)
  if (!tpl.includes("{{NAME}}"))
    throw new Error("ats.html is not the resume template");
  if (css.length < 20) throw new Error("style.css looks empty");

  _templateHtml = tpl;
  _css = css;
}

export function usePreviewHtml(resume: ResumeData) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      (async () => {
        try {
          await loadAssets();
          const rendered = renderResumeHtml(resume, _templateHtml, _css);
          setHtml(rendered);
        } catch (e) {
          console.error("[usePreviewHtml] failed", e);
          setHtml("");
        }
      })();
    }, 300);

    return () => clearTimeout(timer);
  }, [resume]);

  return html;
}
