// packages/core/src/index.ts
export type {
  ResumeData,
  SkillGroup,
  Project,
  ProjectLink,
  Experience,
  Education,
  Language,
  ResumeLabels,
  SectionKey,
} from "./types";

export {
  renderResumeHtml,
  renderContactHtml,
  escapeHtml,
  renderSkillsHtml,
  renderBulletsHtml,
  renderProjectsHtml,
  renderExperienceHtml,
  renderEducationHtml,
  renderLanguagesHtml,
} from "./renderer";
