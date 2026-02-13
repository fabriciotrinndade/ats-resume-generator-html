import { useNavigate } from "react-router-dom";
import { useResumeStore } from "@/hooks/useResumeStore";
import { usePreviewHtml } from "@/hooks/usePreviewHtml";

export default function PreviewPage() {
  const navigate = useNavigate();
  const { resume, exportPdf } = useResumeStore();
  const html = usePreviewHtml(resume);

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col">
      {/* toolbar */}
      <header className="sticky top-0 z-30 bg-bg-primary border-b border-border-secondary shadow-xs">
        <div className="max-w-[var(--max-width-container)] mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-text-primary">
            Resume Preview
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/editor")}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-bg-primary text-text-secondary hover:bg-bg-primary_hover border border-border-primary shadow-xs transition-colors cursor-pointer"
            >
              ← Back to Editor
            </button>
            <button
              onClick={exportPdf}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-brand-solid text-white hover:bg-brand-solid_hover border border-brand-solid shadow-xs transition-colors cursor-pointer"
            >
              Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* full-page preview */}
      <div className="flex-1 flex justify-center p-6">
        <div className="w-full max-w-[850px] bg-white rounded-xl border border-border-secondary shadow-lg overflow-hidden">
          <iframe
            title="Resume Full Preview"
            srcDoc={html}
            className="w-full h-full min-h-[1200px] bg-white"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
