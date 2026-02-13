import { useState, useRef, type ChangeEvent } from "react";
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

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-text-secondary mb-1">
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
      "bg-brand-solid text-white hover:bg-brand-solid_hover border border-brand-solid",
    secondary:
      "bg-bg-primary text-text-secondary hover:bg-bg-primary_hover border border-border-primary",
    destructive:
      "bg-error-50 text-error-700 hover:bg-error-100 border border-error-300",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
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
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<TabId>("Personal");
  const [showPreview, setShowPreview] = useState(false);
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

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* ── header ────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-bg-primary border-b border-border-secondary shadow-xs">
        <div className="max-w-[var(--max-width-container)] mx-auto flex items-center justify-between px-4 py-3 gap-3 flex-wrap">
          <h1 className="text-display-xs font-bold text-text-primary whitespace-nowrap">
            ATS Resume Generator
          </h1>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="secondary" onClick={loadExample}>
              Load Example
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              Import JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
            <Button variant="secondary" onClick={exportJson}>
              Export JSON
            </Button>
            <Button variant="primary" onClick={exportPdf}>
              Export PDF
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowPreview((p) => !p)}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </div>
      </header>

      {/* ── body ──────────────────────────────────── */}
      <div className="max-w-[var(--max-width-container)] mx-auto flex gap-6 p-4">
        {/* editor pane */}
        <div className={`flex-1 min-w-0 ${showPreview ? "max-w-[50%]" : ""}`}>
          {/* tabs */}
          <nav className="flex gap-1 mb-6 overflow-x-auto pb-1">
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
          <div className="bg-bg-primary rounded-xl border border-border-secondary shadow-xs p-6">
            {activeTab === "Personal" && <PersonalTab resume={resume} setField={setField} />}
            {activeTab === "Summary" && <SummaryTab resume={resume} setField={setField} />}
            {activeTab === "Skills" && <SkillsTab resume={resume} dispatch={dispatch} />}
            {activeTab === "Projects" && <ProjectsTab resume={resume} dispatch={dispatch} />}
            {activeTab === "Experience" && <ExperienceTab resume={resume} dispatch={dispatch} />}
            {activeTab === "Education" && <EducationTab resume={resume} dispatch={dispatch} />}
            {activeTab === "Languages" && <LanguagesTab resume={resume} dispatch={dispatch} />}
          </div>
        </div>

        {/* preview pane */}
        {showPreview && (
          <div className="w-1/2 min-w-[400px] sticky top-[73px] self-start">
            <div className="bg-bg-primary rounded-xl border border-border-secondary shadow-xs overflow-hidden">
              <div className="px-4 py-2 bg-bg-secondary border-b border-border-secondary">
                <span className="text-sm font-medium text-text-tertiary">Live Preview</span>
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
          <Input id="name" value={resume.name} onChange={(v) => setField("name", v)} placeholder="John Doe" />
        </div>
        <div>
          <Label htmlFor="title">Title / Headline</Label>
          <Input id="title" value={resume.title} onChange={(v) => setField("title", v)} placeholder="Full Stack Developer" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={resume.email} onChange={(v) => setField("email", v)} placeholder="john@example.com" />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={resume.location} onChange={(v) => setField("location", v)} placeholder="Remote / City, Country" />
        </div>
        <div>
          <Label htmlFor="phone_display">Phone (Display)</Label>
          <Input id="phone_display" value={resume.phone_display} onChange={(v) => setField("phone_display", v)} placeholder="(00) 00000-0000" />
        </div>
        <div>
          <Label htmlFor="phone_e164">Phone (E.164)</Label>
          <Input id="phone_e164" value={resume.phone_e164} onChange={(v) => setField("phone_e164", v)} placeholder="+10000000000" />
        </div>
      </div>

      <SectionTitle>Links</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input id="linkedin_url" value={resume.linkedin_url} onChange={(v) => setField("linkedin_url", v)} placeholder="https://linkedin.com/in/…" />
        </div>
        <div>
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input id="github_url" value={resume.github_url} onChange={(v) => setField("github_url", v)} placeholder="https://github.com/…" />
        </div>
        <div>
          <Label htmlFor="website_url">Website URL</Label>
          <Input id="website_url" value={resume.website_url} onChange={(v) => setField("website_url", v)} placeholder="https://example.com" />
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
        <Button variant="secondary" onClick={() => dispatch({ type: "ADD_SKILL_GROUP" })}>
          + Add Group
        </Button>
      </div>

      {resume.skills.length === 0 && (
        <p className="text-sm text-text-quaternary">No skill groups yet. Add one to get started.</p>
      )}

      {resume.skills.map((group, i) => (
        <div key={i} className="flex gap-3 items-start p-4 rounded-lg border border-border-secondary bg-bg-secondary">
          <div className="flex-1 space-y-3">
            <div>
              <Label>Group Name</Label>
              <Input
                value={group.group}
                onChange={(v) => dispatch({ type: "SET_SKILL_GROUP_NAME", index: i, value: v })}
                placeholder="e.g. Programming"
              />
            </div>
            <div>
              <Label>Skills (comma-separated)</Label>
              <Input
                value={group.items.join(", ")}
                onChange={(v) => dispatch({ type: "SET_SKILL_GROUP_ITEMS", index: i, value: v })}
                placeholder="JavaScript, Node.js, React"
              />
            </div>
          </div>
          <Button variant="destructive" onClick={() => dispatch({ type: "REMOVE_SKILL_GROUP", index: i })}>
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
        <Button variant="secondary" onClick={() => dispatch({ type: "ADD_PROJECT" })}>
          + Add Project
        </Button>
      </div>

      {resume.projects.length === 0 && (
        <p className="text-sm text-text-quaternary">No projects yet.</p>
      )}

      {resume.projects.map((proj, i) => (
        <div key={i} className="space-y-3 p-4 rounded-lg border border-border-secondary bg-bg-secondary">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-text-primary">Project {i + 1}</span>
            <Button variant="destructive" onClick={() => dispatch({ type: "REMOVE_PROJECT", index: i })}>
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Title</Label>
              <Input
                value={proj.title}
                onChange={(v) => dispatch({ type: "SET_PROJECT_FIELD", index: i, field: "title", value: v })}
                placeholder="Project name"
              />
            </div>
            <div>
              <Label>Stack</Label>
              <Input
                value={proj.stack}
                onChange={(v) => dispatch({ type: "SET_PROJECT_FIELD", index: i, field: "stack", value: v })}
                placeholder="Node.js, React, PostgreSQL"
              />
            </div>
          </div>
          <div>
            <Label>Bullet Points (one per line)</Label>
            <Textarea
              value={proj.bullets.join("\n")}
              onChange={(v) => dispatch({ type: "SET_PROJECT_BULLETS", index: i, value: v })}
              placeholder="Describe what you built…"
              rows={3}
            />
          </div>

          {/* links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">Links</span>
              <Button variant="secondary" onClick={() => dispatch({ type: "ADD_PROJECT_LINK", index: i })}>
                + Add Link
              </Button>
            </div>
            {(proj.links ?? []).map((link, li) => (
              <div key={li} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>Label</Label>
                  <Input
                    value={link.label}
                    onChange={(v) => dispatch({ type: "SET_PROJECT_LINK", index: i, linkIndex: li, field: "label", value: v })}
                    placeholder="Repository"
                  />
                </div>
                <div className="flex-1">
                  <Label>URL</Label>
                  <Input
                    value={link.url}
                    onChange={(v) => dispatch({ type: "SET_PROJECT_LINK", index: i, linkIndex: li, field: "url", value: v })}
                    placeholder="https://github.com/…"
                  />
                </div>
                <Button variant="destructive" onClick={() => dispatch({ type: "REMOVE_PROJECT_LINK", index: i, linkIndex: li })}>
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
        <Button variant="secondary" onClick={() => dispatch({ type: "ADD_EXPERIENCE" })}>
          + Add Experience
        </Button>
      </div>

      {resume.experience.length === 0 && (
        <p className="text-sm text-text-quaternary">No experience added yet.</p>
      )}

      {resume.experience.map((exp, i) => (
        <div key={i} className="space-y-3 p-4 rounded-lg border border-border-secondary bg-bg-secondary">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-text-primary">Experience {i + 1}</span>
            <Button variant="destructive" onClick={() => dispatch({ type: "REMOVE_EXPERIENCE", index: i })}>
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Role</Label>
              <Input
                value={exp.role}
                onChange={(v) => dispatch({ type: "SET_EXPERIENCE_FIELD", index: i, field: "role", value: v })}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={exp.company}
                onChange={(v) => dispatch({ type: "SET_EXPERIENCE_FIELD", index: i, field: "company", value: v })}
                placeholder="Company Name"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                value={exp.date}
                onChange={(v) => dispatch({ type: "SET_EXPERIENCE_FIELD", index: i, field: "date", value: v })}
                placeholder="2021 — Present"
              />
            </div>
          </div>
          <div>
            <Label>Bullet Points (one per line)</Label>
            <Textarea
              value={exp.bullets.join("\n")}
              onChange={(v) => dispatch({ type: "SET_EXPERIENCE_BULLETS", index: i, value: v })}
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
        <Button variant="secondary" onClick={() => dispatch({ type: "ADD_EDUCATION" })}>
          + Add Education
        </Button>
      </div>

      {resume.education.length === 0 && (
        <p className="text-sm text-text-quaternary">No education entries yet.</p>
      )}

      {resume.education.map((edu, i) => (
        <div key={i} className="space-y-3 p-4 rounded-lg border border-border-secondary bg-bg-secondary">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-text-primary">Education {i + 1}</span>
            <Button variant="destructive" onClick={() => dispatch({ type: "REMOVE_EDUCATION", index: i })}>
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Title / Degree</Label>
              <Input
                value={edu.title}
                onChange={(v) => dispatch({ type: "SET_EDUCATION_FIELD", index: i, field: "title", value: v })}
                placeholder="Bachelor's in Computer Science"
              />
            </div>
            <div>
              <Label>School / Institution</Label>
              <Input
                value={edu.subtitle}
                onChange={(v) => dispatch({ type: "SET_EDUCATION_FIELD", index: i, field: "subtitle", value: v })}
                placeholder="University Name"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                value={edu.date}
                onChange={(v) => dispatch({ type: "SET_EDUCATION_FIELD", index: i, field: "date", value: v })}
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
        <Button variant="secondary" onClick={() => dispatch({ type: "ADD_LANGUAGE" })}>
          + Add Language
        </Button>
      </div>

      {resume.languages.length === 0 && (
        <p className="text-sm text-text-quaternary">No languages added yet.</p>
      )}

      {resume.languages.map((lang, i) => (
        <div key={i} className="space-y-3 p-4 rounded-lg border border-border-secondary bg-bg-secondary">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-text-primary">Language {i + 1}</span>
            <Button variant="destructive" onClick={() => dispatch({ type: "REMOVE_LANGUAGE", index: i })}>
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Language</Label>
              <Input
                value={lang.name}
                onChange={(v) => dispatch({ type: "SET_LANGUAGE_FIELD", index: i, field: "name", value: v })}
                placeholder="English"
              />
            </div>
            <div>
              <Label>Level</Label>
              <Input
                value={lang.level}
                onChange={(v) => dispatch({ type: "SET_LANGUAGE_FIELD", index: i, field: "level", value: v })}
                placeholder="Intermediate"
              />
            </div>
            <div>
              <Label>Note</Label>
              <Input
                value={lang.note}
                onChange={(v) => dispatch({ type: "SET_LANGUAGE_FIELD", index: i, field: "note", value: v })}
                placeholder="Technical reading and writing"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
