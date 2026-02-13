import { useEffect, useState } from "react";
import type { ResumeData } from "@ats-resume/core";
import { renderResumeHtml } from "@ats-resume/core";

let _templateHtml = "";
let _css = "";

async function loadAssets() {
  if (_templateHtml && _css) return;
  const [tplRes, cssRes] = await Promise.all([
    fetch("/templates/ats.html"),
    fetch("/templates/style.css"),
  ]);
  _templateHtml = await tplRes.text();
  _css = await cssRes.text();
}

/**
 * Given a ResumeData object, produces a full HTML string
 * suitable for rendering inside an iframe's srcdoc.
 * Debounces by 300 ms so it doesn't re-render on every keystroke.
 */
export function usePreviewHtml(resume: ResumeData) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      await loadAssets();
      const rendered = renderResumeHtml(resume, _templateHtml, _css);
      setHtml(rendered);
    }, 300);
    return () => clearTimeout(timer);
  }, [resume]);

  return html;
}
