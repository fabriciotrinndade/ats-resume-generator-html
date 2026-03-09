import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const templatePath = path.join(root, "templates", "cover-letter.html");
const cssPath = path.join(root, "templates", "style.css");
const dataPath = path.join(root, "data", "cover-letter.example.json");

const distDir = path.join(root, "dist");
fs.mkdirSync(distDir, { recursive: true });

const tpl = fs.readFileSync(templatePath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const html = tpl
  .replace(
    `<link rel="stylesheet" href="./style.css" />`,
    `<style>${css}</style>`,
  )
  .replaceAll("{{NAME}}", escapeHtml(data.name))
  .replaceAll("{{TITLE}}", escapeHtml(data.title))
  .replaceAll("{{EMAIL}}", escapeHtml(data.email))
  .replaceAll("{{PHONE}}", escapeHtml(data.phone_display))
  .replaceAll("{{LOCATION}}", escapeHtml(data.location))
  .replaceAll("{{DATE}}", escapeHtml(data.date))
  .replaceAll("{{GREETING}}", escapeHtml(data.letter.greeting))
  .replaceAll("{{INTRO}}", escapeHtml(data.letter.intro))
  .replaceAll("{{BODY}}", escapeHtml(data.letter.body))
  .replaceAll("{{CLOSING}}", escapeHtml(data.letter.closing));

fs.writeFileSync(path.join(distDir, "cover-letter.html"), html, "utf8");

console.log("Gerado: dist/cover-letter.html");
