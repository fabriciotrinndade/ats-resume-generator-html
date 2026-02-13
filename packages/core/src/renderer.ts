import type {
  ResumeData,
  SkillGroup,
  Project,
  Experience,
  Education,
  Language,
} from "./types.js";

export function escapeHtml(s: string): string {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderSkillsHtml(skills: SkillGroup[]): string {
  return skills
    .map(
      (g) =>
        `<div class="item"><div class="item-title">${escapeHtml(g.group)}:</div> ${escapeHtml(
          g.items.join(", "),
        )}</div>`,
    )
    .join("\n");
}

export function renderBulletsHtml(bullets: string[]): string {
  return `<ul class="bullets">${bullets
    .map((b) => `<li>${escapeHtml(b)}</li>`)
    .join("")}</ul>`;
}

export function renderProjectsHtml(projects: Project[]): string {
  return projects
    .map((p) => {
      const links = (p.links ?? [])
        .map(
          (l) =>
            `<li>${escapeHtml(l.label)}: <a href="${l.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(
              l.url,
            )}</a></li>`,
        )
        .join("");
      return `
<div class="item">
  <div class="item-title">${escapeHtml(p.title)}</div>
  <div class="tech-line">Stack: ${escapeHtml(p.stack)}</div>
  ${renderBulletsHtml(p.bullets)}
  ${links ? `<ul class="bullets">${links}</ul>` : ""}
</div>`;
    })
    .join("\n");
}

export function renderExperienceHtml(exps: Experience[]): string {
  return exps
    .map(
      (e) => `
<div class="item">
  <div class="item-header">
    <div>
      <div class="item-title">${escapeHtml(e.role)}</div>
      <div class="item-subtitle">${escapeHtml(e.company)}</div>
    </div>
    <div class="item-date">${escapeHtml(e.date)}</div>
  </div>
  ${renderBulletsHtml(e.bullets)}
</div>`,
    )
    .join("\n");
}

export function renderEducationHtml(eds: Education[]): string {
  return eds
    .map(
      (e) => `
<div class="item">
  <div class="item-header">
    <div>
      <div class="item-title">${escapeHtml(e.title)}</div>
      <div class="item-subtitle">${escapeHtml(e.subtitle)}</div>
    </div>
    <div class="item-date">${escapeHtml(e.date)}</div>
  </div>
</div>`,
    )
    .join("\n");
}

export function renderLanguagesHtml(langs: Language[]): string {
  return langs
    .map(
      (l) => `
<div class="item">
  <div class="item-header">
    <div class="item-title">${escapeHtml(l.name)} — ${escapeHtml(l.level)}</div>
    <div class="item-date">${escapeHtml(l.note)}</div>
  </div>
</div>`,
    )
    .join("\n");
}

/**
 * Builds the contact line with pipes only between items that have content.
 * Row 1: email | phone | location
 * Row 2: linkedin | github | website
 */
export function renderContactHtml(data: ResumeData): string {
  const row1: string[] = [];
  if (data.email) {
    row1.push(
      `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`,
    );
  }
  if (data.phone_display && data.phone_e164) {
    row1.push(
      `<a href="tel:${escapeHtml(data.phone_e164)}">${escapeHtml(data.phone_display)}</a>`,
    );
  } else if (data.phone_display) {
    row1.push(escapeHtml(data.phone_display));
  }
  if (data.location) {
    row1.push(escapeHtml(data.location));
  }

  const row2: string[] = [];
  if (data.linkedin_url) {
    const text = data.linkedin_url.replace(/^https?:\/\//, "");
    row2.push(
      `<a href="${data.linkedin_url}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`,
    );
  }
  if (data.github_url) {
    const text = data.github_url.replace(/^https?:\/\//, "");
    row2.push(
      `<a href="${data.github_url}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`,
    );
  }
  if (data.website_url) {
    const text = data.website_url.replace(/^https?:\/\//, "");
    row2.push(
      `<a href="${data.website_url}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`,
    );
  }

  const parts: string[] = [];
  if (row1.length) parts.push(row1.join(" | "));
  if (row2.length) parts.push(row2.join(" | "));

  return parts.join("<br />");
}

/**
 * Renders a complete HTML resume from structured data + template + CSS.
 * The CSS is inlined into the HTML (critical for PDF export).
 */
export function renderResumeHtml(
  data: ResumeData,
  templateHtml: string,
  css: string,
): string {
  return templateHtml
    .replace(
      `<link rel="stylesheet" href="./style.css" />`,
      `<style>${css}</style>`,
    )
    .replaceAll("{{NAME}}", escapeHtml(data.name))
    .replaceAll("{{TITLE}}", escapeHtml(data.title))
    .replaceAll("{{CONTACT_HTML}}", renderContactHtml(data))
    .replaceAll("{{SUMMARY}}", escapeHtml(data.summary))
    .replaceAll("{{SKILLS_HTML}}", renderSkillsHtml(data.skills))
    .replaceAll("{{PROJECTS_HTML}}", renderProjectsHtml(data.projects))
    .replaceAll("{{EXPERIENCE_HTML}}", renderExperienceHtml(data.experience))
    .replaceAll("{{EDUCATION_HTML}}", renderEducationHtml(data.education))
    .replaceAll("{{LANGUAGES_HTML}}", renderLanguagesHtml(data.languages));
}
