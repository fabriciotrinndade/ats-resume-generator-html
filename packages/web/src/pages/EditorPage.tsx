import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { usePreviewHtml } from "@/hooks/usePreviewHtml";
import type { ResumeData } from "@ats-resume/core";

/* ── tiny reusable bits ──────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-text-primary border-b border-border-secondary pb-2 mb-4">
      {children}
    </h2>
  );
}

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-text-secondary mb-1"
    >
      {children}
    </label>
  );
}

function Input({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-focus-ring focus:border-border-brand transition-colors"
    />
  );
}

function Textarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-focus-ring focus:border-border-brand transition-colors resize-y"
    />
  );
}

function Button({
  children,
  onClick,
  variant = "secondary",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "destructive";
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-xs transition-colors cursor-pointer";
  const variants = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 border border-brand-600",
    secondary:
      "bg-bg-primary text-text-secondary hover:bg-bg-primary_hover border border-border-primary",
    destructive:
      "bg-error-50 text-error-700 hover:bg-error-100 border border-error-300",
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ── confirmation modal ───────────────────────────────────────────── */

function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-bg-overlay/60" onClick={onCancel} />

      {/* dialog */}
      <div className="relative bg-bg-primary rounded-xl border border-border-secondary shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-sm text-text-secondary mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── tab data ────────────────────────────────────────────────────── */

const TABS = [
  "Personal",
  "Summary",
  "Skills",
  "Projects",
  "Experience",
  "Education",
  "Languages",
] as const;

type TabId = (typeof TABS)[number];

/* ── main page ───────────────────────────────────────────────────── */

export default function EditorPage() {
  const {
    resume,
    dispatch,
    setField,
    loadJson,
    loadExample,
    exportJson,
    exportPdf,
    resetResume,
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<TabId>("Personal");
  const [showPreview, setShowPreview] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const previewHtml = usePreviewHtml(resume);

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadJson(reader.result as string);
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await exportPdf(previewHtml);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearConfirm = () => {
    resetResume();
    setShowClearModal(false);
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* ── clear confirmation modal ── */}
      <ConfirmModal
        open={showClearModal}
        title="Clear all data?"
        message="This will erase all fields and sections you've filled in. This action cannot be undone."
        confirmLabel="Clear All"
        onConfirm={handleClearConfirm}
        onCancel={() => setShowClearModal(false)}
      />

      {/* ── header ────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-bg-primary border-b border-border-secondary shadow-xs">
        <div className="max-w-[var(--max-width-container)] mx-auto flex items-center justify-between px-4 py-3 gap-4">
          <h1 className="text-display-xs font-bold text-text-primary whitespace-nowrap">
            ATSRG
          </h1>

          {/* ── mobile hamburger ── */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-primary_hover transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </svg>
            )}
          </button>

          {/* ── desktop buttons ── */}
          <div className="hidden lg:flex items-center gap-6">
            {/* ── load data ── */}
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={loadExample}>
                Load Example
              </Button>
              <Button
                variant="secondary"
                onClick={() => fileRef.current?.click()}
              >
                Import JSON
              </Button>
            </div>

            <div className="w-px h-6 bg-border-secondary" />

            {/* ── export ── */}
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={exportJson}>
                Export JSON
              </Button>
              <Button
                variant="primary"
                onClick={handleExportPdf}
                className={isExporting ? "opacity-60 pointer-events-none" : ""}
              >
                {isExporting ? "Exporting…" : "Export PDF"}
              </Button>
            </div>

            <div className="w-px h-6 bg-border-secondary" />

            {/* ── view ── */}
            <Button
              variant="secondary"
              onClick={() => setShowPreview((p) => !p)}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>

            <div className="w-px h-6 bg-border-secondary" />

            {/* ── danger zone ── */}
            <Button
              variant="destructive"
              onClick={() => setShowClearModal(true)}
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* ── mobile menu dropdown ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border-secondary bg-bg-primary px-4 py-3 space-y-3 animate-in slide-in-from-top-2 duration-150">
            {/* load */}
            <div>
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                Load Data
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    loadExample();
                    setMobileMenuOpen(false);
                  }}
                >
                  Load Example
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    fileRef.current?.click();
                    setMobileMenuOpen(false);
                  }}
                >
                  Import JSON
                </Button>
              </div>
            </div>
            {/* export */}
            <div className="border-t border-border-secondary pt-3">
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                Export
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    exportJson();
                    setMobileMenuOpen(false);
                  }}
                >
                  Export JSON
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleExportPdf();
                    setMobileMenuOpen(false);
                  }}
                  className={
                    isExporting ? "opacity-60 pointer-events-none" : ""
                  }
                >
                  {isExporting ? "Exporting…" : "Export PDF"}
                </Button>
              </div>
            </div>
            {/* view */}
            <div className="border-t border-border-secondary pt-3">
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                View
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowPreview((p) => !p);
                  setMobileMenuOpen(false);
                }}
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>
            {/* danger */}
            <div className="border-t border-border-secondary pt-3">
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                Danger Zone
              </p>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowClearModal(true);
                  setMobileMenuOpen(false);
                }}
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* hidden file input (shared by desktop & mobile) */}
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />

      {/* ── body ──────────────────────────────────── */}
      <div className="max-w-[var(--max-width-container)] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 p-4">
        {/* editor pane */}
        <div
          className={`flex-1 min-w-0 ${showPreview ? "lg:max-w-[50%]" : ""}`}
        >
          {/* tabs */}
          <nav className="flex gap-1 mb-4 lg:mb-6 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-brand-50 text-brand-700 border border-brand-200"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-bg-primary_hover border border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* tab content */}
          <div className="bg-bg-primary rounded-xl border border-border-secondary shadow-xs p-4 lg:p-6">
            {activeTab === "Personal" && (
              <PersonalTab resume={resume} setField={setField} />
            )}
            {activeTab === "Summary" && (
              <SummaryTab resume={resume} setField={setField} />
            )}
            {activeTab === "Skills" && (
              <SkillsTab resume={resume} dispatch={dispatch} />
            )}
            {activeTab === "Projects" && (
              <ProjectsTab resume={resume} dispatch={dispatch} />
            )}
            {activeTab === "Experience" && (
              <ExperienceTab resume={resume} dispatch={dispatch} />
            )}
            {activeTab === "Education" && (
              <EducationTab resume={resume} dispatch={dispatch} />
            )}
            {activeTab === "Languages" && (
              <LanguagesTab resume={resume} dispatch={dispatch} />
            )}
          </div>
        </div>

        {/* preview pane */}
        {showPreview && (
          <div className="w-full lg:w-1/2 lg:min-w-[400px] lg:sticky lg:top-[73px] lg:self-start">
            <div className="bg-bg-primary rounded-xl border border-border-secondary shadow-xs overflow-hidden">
              <div className="px-4 py-2 bg-bg-secondary border-b border-border-secondary">
                <span className="text-sm font-medium text-text-tertiary">
                  Live Preview
                </span>
              </div>
              <iframe
                title="Resume Preview"
                srcDoc={previewHtml}
                className="w-full bg-white"
                style={{ height: "calc(100vh - 140px)" }}
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Personal info ───────────────────────────────────────────────── */

function PersonalTab({
  resume,
  setField,
}: {
  resume: ResumeData;
  setField: (f: keyof ResumeData, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionTitle>Personal Information</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={resume.name}
            onChange={(v) => setField("name", v)}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="title">Title / Headline</Label>
          <Input
            id="title"
            value={resume.title}
            onChange={(v) => setField("title", v)}
            placeholder="Full Stack Developer"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={resume.email}
            onChange={(v) => setField("email", v)}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={resume.location}
            onChange={(v) => setField("location", v)}
            placeholder="Remote / City, Country"
          />
        </div>
        <div>
          <Label htmlFor="phone_display">Phone (Display)</Label>
          <Input
            id="phone_display"
            value={resume.phone_display}
            onChange={(v) => setField("phone_display", v)}
            placeholder="(00) 00000-0000"
          />
        </div>
        <div>
          <Label htmlFor="phone_e164">Phone (E.164)</Label>
          <Input
            id="phone_e164"
            value={resume.phone_e164}
            onChange={(v) => setField("phone_e164", v)}
            placeholder="+10000000000"
          />
        </div>
      </div>

      <SectionTitle>Links</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            id="linkedin_url"
            value={resume.linkedin_url}
            onChange={(v) => setField("linkedin_url", v)}
            placeholder="https://linkedin.com/in/…"
          />
        </div>
        <div>
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            value={resume.github_url}
            onChange={(v) => setField("github_url", v)}
            placeholder="https://github.com/…"
          />
        </div>
        <div>
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            value={resume.website_url}
            onChange={(v) => setField("website_url", v)}
            placeholder="https://example.com"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Summary ─────────────────────────────────────────────────────── */

function SummaryTab({
  resume,
  setField,
}: {
  resume: ResumeData;
  setField: (f: keyof ResumeData, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionTitle>Professional Summary</SectionTitle>
      <Textarea
        id="summary"
        value={resume.summary}
        onChange={(v) => setField("summary", v)}
        placeholder="A brief summary of your professional profile…"
        rows={5}
      />
    </div>
  );
}

/* ── Skill items input (local state to allow commas) ─────────────── */

function SkillItemsInput({
  items,
  onChange,
}: {
  items: string[];
  onChange: (v: string) => void;
}) {
  const [raw, setRaw] = useState(items.join(", "));

  // Sync from external changes (e.g. Load Example, Import JSON)
  useEffect(() => {
    setRaw(items.join(", "));
  }, [items.join(",")]);

  return (
    <input
      type="text"
      value={raw}
      onChange={(e) => setRaw(e.target.value)}
      onBlur={() => onChange(raw)}
      placeholder="JavaScript, Node.js, React"
      className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-focus-ring focus:border-border-brand transition-colors"
    />
  );
}

/* ── Skills ──────────────────────────────────────────────────────── */

function SkillsTab({
  resume,
  dispatch,
}: {
  resume: ResumeData;
  dispatch: React.Dispatch<any>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Skills</SectionTitle>
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: "ADD_SKILL_GROUP" })}
        >
          + Add Group
        </Button>
      </div>

      {resume.skills.length === 0 && (
        <p className="text-sm text-text-quaternary">
          No skill groups yet. Add one to get started.
        </p>
      )}

      {resume.skills.map((group, i) => (
        <div
          key={i}
          className="flex gap-3 items-start p-4 rounded-lg border border-border-secondary bg-bg-secondary"
        >
          <div className="flex-1 space-y-3">
            <div>
              <Label>Group Name</Label>
              <Input
                value={group.group}
                onChange={(v) =>
                  dispatch({ type: "SET_SKILL_GROUP_NAME", index: i, value: v })
                }
                placeholder="e.g. Programming"
              />
            </div>
            <div>
              <Label>Skills (comma-separated)</Label>
              <SkillItemsInput
                items={group.items}
                onChange={(v) =>
                  dispatch({
                    type: "SET_SKILL_GROUP_ITEMS",
                    index: i,
                    value: v,
                  })
                }
              />
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => dispatch({ type: "REMOVE_SKILL_GROUP", index: i })}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}

/* ── Projects ────────────────────────────────────────────────────── */

function ProjectsTab({
  resume,
  dispatch,
}: {
  resume: ResumeData;
  dispatch: React.Dispatch<any>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Projects</SectionTitle>
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: "ADD_PROJECT" })}
        >
          + Add Project
        </Button>
      </div>

      {resume.projects.length === 0 && (
        <p className="text-sm text-text-quaternary">No projects yet.</p>
      )}

      {resume.projects.map((proj, i) => (
        <div
          key={i}
          className="space-y-3 p-4 rounded-lg border border-border-secondary bg-bg-secondary"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-text-primary">
              Project {i + 1}
            </span>
            <Button
              variant="destructive"
              onClick={() => dispatch({ type: "REMOVE_PROJECT", index: i })}
            >
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Title</Label>
              <Input
                value={proj.title}
                onChange={(v) =>
                  dispatch({
                    type: "SET_PROJECT_FIELD",
                    index: i,
                    field: "title",
                    value: v,
                  })
                }
                placeholder="Project name"
              />
            </div>
            <div>
              <Label>Stack</Label>
              <Input
                value={proj.stack}
                onChange={(v) =>
                  dispatch({
                    type: "SET_PROJECT_FIELD",
                    index: i,
                    field: "stack",
                    value: v,
                  })
                }
                placeholder="Node.js, React, PostgreSQL"
              />
            </div>
          </div>
          <div>
            <Label>Bullet Points (one per line)</Label>
            <Textarea
              value={proj.bullets.join("\n")}
              onChange={(v) =>
                dispatch({ type: "SET_PROJECT_BULLETS", index: i, value: v })
              }
              placeholder="Describe what you built…"
              rows={3}
            />
          </div>

          {/* links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">
                Links
              </span>
              <Button
                variant="secondary"
                onClick={() => dispatch({ type: "ADD_PROJECT_LINK", index: i })}
              >
                + Add Link
              </Button>
            </div>
            {(proj.links ?? []).map((link, li) => (
              <div key={li} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>Label</Label>
                  <Input
                    value={link.label}
                    onChange={(v) =>
                      dispatch({
                        type: "SET_PROJECT_LINK",
                        index: i,
                        linkIndex: li,
                        field: "label",
                        value: v,
                      })
                    }
                    placeholder="Repository"
                  />
                </div>
                <div className="flex-1">
                  <Label>URL</Label>
                  <Input
                    value={link.url}
                    onChange={(v) =>
                      dispatch({
                        type: "SET_PROJECT_LINK",
                        index: i,
                        linkIndex: li,
                        field: "url",
                        value: v,
                      })
                    }
                    placeholder="https://github.com/…"
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_PROJECT_LINK",
                      index: i,
                      linkIndex: li,
                    })
                  }
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Experience ──────────────────────────────────────────────────── */

function ExperienceTab({
  resume,
  dispatch,
}: {
  resume: ResumeData;
  dispatch: React.Dispatch<any>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Experience</SectionTitle>
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: "ADD_EXPERIENCE" })}
        >
          + Add Experience
        </Button>
      </div>

      {resume.experience.length === 0 && (
        <p className="text-sm text-text-quaternary">No experience added yet.</p>
      )}

      {resume.experience.map((exp, i) => (
        <div
          key={i}
          className="space-y-3 p-4 rounded-lg border border-border-secondary bg-bg-secondary"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-text-primary">
              Experience {i + 1}
            </span>
            <Button
              variant="destructive"
              onClick={() => dispatch({ type: "REMOVE_EXPERIENCE", index: i })}
            >
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Role</Label>
              <Input
                value={exp.role}
                onChange={(v) =>
                  dispatch({
                    type: "SET_EXPERIENCE_FIELD",
                    index: i,
                    field: "role",
                    value: v,
                  })
                }
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={exp.company}
                onChange={(v) =>
                  dispatch({
                    type: "SET_EXPERIENCE_FIELD",
                    index: i,
                    field: "company",
                    value: v,
                  })
                }
                placeholder="Company Name"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                value={exp.date}
                onChange={(v) =>
                  dispatch({
                    type: "SET_EXPERIENCE_FIELD",
                    index: i,
                    field: "date",
                    value: v,
                  })
                }
                placeholder="2021 — Present"
              />
            </div>
          </div>
          <div>
            <Label>Bullet Points (one per line)</Label>
            <Textarea
              value={exp.bullets.join("\n")}
              onChange={(v) =>
                dispatch({ type: "SET_EXPERIENCE_BULLETS", index: i, value: v })
              }
              placeholder="Describe responsibilities and achievements…"
              rows={4}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Education ───────────────────────────────────────────────────── */

function EducationTab({
  resume,
  dispatch,
}: {
  resume: ResumeData;
  dispatch: React.Dispatch<any>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Education</SectionTitle>
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: "ADD_EDUCATION" })}
        >
          + Add Education
        </Button>
      </div>

      {resume.education.length === 0 && (
        <p className="text-sm text-text-quaternary">
          No education entries yet.
        </p>
      )}

      {resume.education.map((edu, i) => (
        <div
          key={i}
          className="space-y-3 p-4 rounded-lg border border-border-secondary bg-bg-secondary"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-text-primary">
              Education {i + 1}
            </span>
            <Button
              variant="destructive"
              onClick={() => dispatch({ type: "REMOVE_EDUCATION", index: i })}
            >
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Title / Degree</Label>
              <Input
                value={edu.title}
                onChange={(v) =>
                  dispatch({
                    type: "SET_EDUCATION_FIELD",
                    index: i,
                    field: "title",
                    value: v,
                  })
                }
                placeholder="Bachelor's in Computer Science"
              />
            </div>
            <div>
              <Label>School / Institution</Label>
              <Input
                value={edu.subtitle}
                onChange={(v) =>
                  dispatch({
                    type: "SET_EDUCATION_FIELD",
                    index: i,
                    field: "subtitle",
                    value: v,
                  })
                }
                placeholder="University Name"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                value={edu.date}
                onChange={(v) =>
                  dispatch({
                    type: "SET_EDUCATION_FIELD",
                    index: i,
                    field: "date",
                    value: v,
                  })
                }
                placeholder="2019 — 2023"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Languages ───────────────────────────────────────────────────── */

function LanguagesTab({
  resume,
  dispatch,
}: {
  resume: ResumeData;
  dispatch: React.Dispatch<any>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Languages</SectionTitle>
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: "ADD_LANGUAGE" })}
        >
          + Add Language
        </Button>
      </div>

      {resume.languages.length === 0 && (
        <p className="text-sm text-text-quaternary">No languages added yet.</p>
      )}

      {resume.languages.map((lang, i) => (
        <div
          key={i}
          className="space-y-3 p-4 rounded-lg border border-border-secondary bg-bg-secondary"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-text-primary">
              Language {i + 1}
            </span>
            <Button
              variant="destructive"
              onClick={() => dispatch({ type: "REMOVE_LANGUAGE", index: i })}
            >
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Language</Label>
              <Input
                value={lang.name}
                onChange={(v) =>
                  dispatch({
                    type: "SET_LANGUAGE_FIELD",
                    index: i,
                    field: "name",
                    value: v,
                  })
                }
                placeholder="English"
              />
            </div>
            <div>
              <Label>Level</Label>
              <Input
                value={lang.level}
                onChange={(v) =>
                  dispatch({
                    type: "SET_LANGUAGE_FIELD",
                    index: i,
                    field: "level",
                    value: v,
                  })
                }
                placeholder="Intermediate"
              />
            </div>
            <div>
              <Label>Note</Label>
              <Input
                value={lang.note}
                onChange={(v) =>
                  dispatch({
                    type: "SET_LANGUAGE_FIELD",
                    index: i,
                    field: "note",
                    value: v,
                  })
                }
                placeholder="Technical reading and writing"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
