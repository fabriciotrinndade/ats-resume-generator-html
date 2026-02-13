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
    .replaceAll("{{EMAIL}}", escapeHtml(data.email))
    .replaceAll("{{PHONE_E164}}", escapeHtml(data.phone_e164))
    .replaceAll("{{PHONE_DISPLAY}}", escapeHtml(data.phone_display))
    .replaceAll("{{LOCATION}}", escapeHtml(data.location))
    .replaceAll("{{LINKEDIN_URL}}", data.linkedin_url)
    .replaceAll("{{GITHUB_URL}}", data.github_url)
    .replaceAll("{{WEBSITE_URL}}", data.website_url)
    .replaceAll(
      "{{LINKEDIN_TEXT}}",
      data.linkedin_url.replace(/^https?:\/\//, ""),
    )
    .replaceAll(
      "{{GITHUB_TEXT}}",
      data.github_url.replace(/^https?:\/\//, ""),
    )
    .replaceAll(
      "{{WEBSITE_TEXT}}",
      data.website_url.replace(/^https?:\/\//, ""),
    )
    .replaceAll("{{SUMMARY}}", escapeHtml(data.summary))
    .replaceAll("{{SKILLS_HTML}}", renderSkillsHtml(data.skills))
    .replaceAll("{{PROJECTS_HTML}}", renderProjectsHtml(data.projects))
    .replaceAll("{{EXPERIENCE_HTML}}", renderExperienceHtml(data.experience))
    .replaceAll("{{EDUCATION_HTML}}", renderEducationHtml(data.education))
    .replaceAll("{{LANGUAGES_HTML}}", renderLanguagesHtml(data.languages));
}
