import { useCallback, useMemo, useReducer } from "react";
import type {
  ResumeData,
  SkillGroup,
  Project,
  Experience,
  Education,
  Language,
  ProjectLink,
  SectionKey,
} from "@ats-resume/core";

/* ── helpers ─────────────────────────────────────────────────────── */

function emptyResume(): ResumeData {
  return {
    name: "",
    title: "",
    email: "",
    phone_e164: "",
    phone_display: "",
    location: "",
    linkedin_url: "",
    github_url: "",
    website_url: "",
    summary: "",
    skills: [],
    projects: [],
    experience: [],
    education: [],
    languages: [],
    labels: {}, // ✅ habilita custom labels
  };
}

/* ── action types ────────────────────────────────────────────────── */

type Action =
  | { type: "SET_FIELD"; field: keyof ResumeData; value: any } // ✅ value não só string
  | { type: "SET_LABEL"; key: SectionKey; value: string } // ✅ labels editáveis
  | { type: "REPLACE_ALL"; data: ResumeData }
  | { type: "RESET" }
  // Skills
  | { type: "ADD_SKILL_GROUP" }
  | { type: "REMOVE_SKILL_GROUP"; index: number }
  | { type: "SET_SKILL_GROUP_NAME"; index: number; value: string }
  | { type: "SET_SKILL_GROUP_ITEMS"; index: number; value: string }
  // Projects
  | { type: "ADD_PROJECT" }
  | { type: "REMOVE_PROJECT"; index: number }
  | {
      type: "SET_PROJECT_FIELD";
      index: number;
      field: keyof Project;
      value: string;
    }
  | { type: "SET_PROJECT_BULLETS"; index: number; value: string }
  | { type: "ADD_PROJECT_LINK"; index: number }
  | { type: "REMOVE_PROJECT_LINK"; index: number; linkIndex: number }
  | {
      type: "SET_PROJECT_LINK";
      index: number;
      linkIndex: number;
      field: keyof ProjectLink;
      value: string;
    }
  // Experience
  | { type: "ADD_EXPERIENCE" }
  | { type: "REMOVE_EXPERIENCE"; index: number }
  | {
      type: "SET_EXPERIENCE_FIELD";
      index: number;
      field: keyof Experience;
      value: string;
    }
  | { type: "SET_EXPERIENCE_BULLETS"; index: number; value: string }
  // Education
  | { type: "ADD_EDUCATION" }
  | { type: "REMOVE_EDUCATION"; index: number }
  | {
      type: "SET_EDUCATION_FIELD";
      index: number;
      field: keyof Education;
      value: string;
    }
  // Languages
  | { type: "ADD_LANGUAGE" }
  | { type: "REMOVE_LANGUAGE"; index: number }
  | {
      type: "SET_LANGUAGE_FIELD";
      index: number;
      field: keyof Language;
      value: string;
    };

/* ── reducer ─────────────────────────────────────────────────────── */

function resumeReducer(state: ResumeData, action: Action): ResumeData {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_LABEL":
      return {
        ...state,
        labels: {
          ...(state.labels ?? {}),
          [action.key]: action.value,
        },
      };

    case "REPLACE_ALL":
      return {
        ...emptyResume(),
        ...action.data,
        labels: action.data.labels ?? {},
      };

    case "RESET":
      return emptyResume();

    /* ── skills ─────────────────────── */
    case "ADD_SKILL_GROUP":
      return { ...state, skills: [...state.skills, { group: "", items: [] }] };

    case "REMOVE_SKILL_GROUP":
      return {
        ...state,
        skills: state.skills.filter((_, i) => i !== action.index),
      };

    case "SET_SKILL_GROUP_NAME":
      return {
        ...state,
        skills: state.skills.map((g, i) =>
          i === action.index ? { ...g, group: action.value } : g,
        ),
      };

    case "SET_SKILL_GROUP_ITEMS":
      return {
        ...state,
        skills: state.skills.map((g, i) =>
          i === action.index
            ? {
                ...g,
                items: action.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }
            : g,
        ),
      };

    /* ── projects ───────────────────── */
    case "ADD_PROJECT":
      return {
        ...state,
        projects: [
          ...state.projects,
          { title: "", stack: "", bullets: [], links: [] },
        ],
      };

    case "REMOVE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((_, i) => i !== action.index),
      };

    case "SET_PROJECT_FIELD":
      return {
        ...state,
        projects: state.projects.map((p, i) =>
          i === action.index ? { ...p, [action.field]: action.value } : p,
        ),
      };

    case "SET_PROJECT_BULLETS":
      return {
        ...state,
        projects: state.projects.map((p, i) =>
          i === action.index ? { ...p, bullets: action.value.split("\n") } : p,
        ),
      };

    case "ADD_PROJECT_LINK":
      return {
        ...state,
        projects: state.projects.map((p, i) =>
          i === action.index
            ? { ...p, links: [...(p.links ?? []), { label: "", url: "" }] }
            : p,
        ),
      };

    case "REMOVE_PROJECT_LINK":
      return {
        ...state,
        projects: state.projects.map((p, i) =>
          i === action.index
            ? {
                ...p,
                links: (p.links ?? []).filter(
                  (_, li) => li !== action.linkIndex,
                ),
              }
            : p,
        ),
      };

    case "SET_PROJECT_LINK":
      return {
        ...state,
        projects: state.projects.map((p, i) =>
          i === action.index
            ? {
                ...p,
                links: (p.links ?? []).map((l, li) =>
                  li === action.linkIndex
                    ? { ...l, [action.field]: action.value }
                    : l,
                ),
              }
            : p,
        ),
      };

    /* ── experience ─────────────────── */
    case "ADD_EXPERIENCE":
      return {
        ...state,
        experience: [
          ...state.experience,
          { role: "", company: "", date: "", bullets: [] },
        ],
      };

    case "REMOVE_EXPERIENCE":
      return {
        ...state,
        experience: state.experience.filter((_, i) => i !== action.index),
      };

    case "SET_EXPERIENCE_FIELD":
      return {
        ...state,
        experience: state.experience.map((e, i) =>
          i === action.index ? { ...e, [action.field]: action.value } : e,
        ),
      };

    case "SET_EXPERIENCE_BULLETS":
      return {
        ...state,
        experience: state.experience.map((e, i) =>
          i === action.index ? { ...e, bullets: action.value.split("\n") } : e,
        ),
      };

    /* ── education ──────────────────── */
    case "ADD_EDUCATION":
      return {
        ...state,
        education: [...state.education, { title: "", subtitle: "", date: "" }],
      };

    case "REMOVE_EDUCATION":
      return {
        ...state,
        education: state.education.filter((_, i) => i !== action.index),
      };

    case "SET_EDUCATION_FIELD":
      return {
        ...state,
        education: state.education.map((e, i) =>
          i === action.index ? { ...e, [action.field]: action.value } : e,
        ),
      };

    /* ── languages ──────────────────── */
    case "ADD_LANGUAGE":
      return {
        ...state,
        languages: [...state.languages, { name: "", level: "", note: "" }],
      };

    case "REMOVE_LANGUAGE":
      return {
        ...state,
        languages: state.languages.filter((_, i) => i !== action.index),
      };

    case "SET_LANGUAGE_FIELD":
      return {
        ...state,
        languages: state.languages.map((l, i) =>
          i === action.index ? { ...l, [action.field]: action.value } : l,
        ),
      };

    default:
      return state;
  }
}

/* ── hook ─────────────────────────────────────────────────────────── */

export function useResumeStore() {
  const [resume, dispatch] = useReducer(resumeReducer, undefined, emptyResume);

  const setField = useCallback(
    (field: keyof ResumeData, value: any) =>
      dispatch({ type: "SET_FIELD", field, value }),
    [],
  );

  const setLabel = useCallback(
    (key: SectionKey, value: string) =>
      dispatch({ type: "SET_LABEL", key, value }),
    [],
  );

  const loadJson = useCallback((json: string) => {
    try {
      const raw = JSON.parse(json);
      if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
        alert("Invalid file: expected a JSON object with resume fields.");
        return;
      }

      const base = emptyResume();
      const data: ResumeData = {
        ...base,
        name: typeof raw.name === "string" ? raw.name : base.name,
        title: typeof raw.title === "string" ? raw.title : base.title,
        email: typeof raw.email === "string" ? raw.email : base.email,
        phone_e164:
          typeof raw.phone_e164 === "string" ? raw.phone_e164 : base.phone_e164,
        phone_display:
          typeof raw.phone_display === "string"
            ? raw.phone_display
            : base.phone_display,
        location:
          typeof raw.location === "string" ? raw.location : base.location,
        linkedin_url:
          typeof raw.linkedin_url === "string"
            ? raw.linkedin_url
            : base.linkedin_url,
        github_url:
          typeof raw.github_url === "string" ? raw.github_url : base.github_url,
        website_url:
          typeof raw.website_url === "string"
            ? raw.website_url
            : base.website_url,
        summary: typeof raw.summary === "string" ? raw.summary : base.summary,
        skills: Array.isArray(raw.skills) ? raw.skills : base.skills,
        projects: Array.isArray(raw.projects) ? raw.projects : base.projects,
        experience: Array.isArray(raw.experience)
          ? raw.experience
          : base.experience,
        education: Array.isArray(raw.education)
          ? raw.education
          : base.education,
        languages: Array.isArray(raw.languages)
          ? raw.languages
          : base.languages,
        labels:
          typeof raw.labels === "object" &&
          raw.labels &&
          !Array.isArray(raw.labels)
            ? raw.labels
            : base.labels,
      };

      dispatch({ type: "REPLACE_ALL", data });
    } catch {
      alert("Could not read this file. Make sure it's a valid JSON file.");
    }
  }, []);

  const loadExample = useCallback(async () => {
    const res = await fetch("/examples/resume.example.json");
    const data = (await res.json()) as ResumeData;
    dispatch({ type: "REPLACE_ALL", data });
  }, []);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [resume]);

  const exportPdf = useCallback(async (html: string) => {
    const base = import.meta.env.VITE_PDF_SERVICE_URL;
    if (!base) throw new Error("Missing VITE_PDF_SERVICE_URL");

    const res = await fetch(`${base}/export-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });

    if (!res.ok) throw new Error(await res.text());

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "cv.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }, []);

  const toJson = useMemo(() => JSON.stringify(resume, null, 2), [resume]);

  const resetResume = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    resume,
    dispatch,
    setField,
    setLabel, // ✅ usar no EditorPage para inputs de títulos
    loadJson,
    loadExample,
    exportJson,
    exportPdf,
    resetResume,
    toJson,
  };
}
