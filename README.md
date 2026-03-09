This project is a lightweight, ATS-first resume generator built for developers and technical professionals who want **full control** over their resume without relying on paid resume builders or restrictive visual editors.

You edit a single structured JSON file, and the system generates:

- a clean, ATS-friendly HTML resume
- a printable PDF with clickable links

No subscriptions. No watermarks. No hidden limitations.

🔗 Community Discord: https://discord.gg/4JcxJfXQ

---

## Why this project exists

Many resume builders:

- charge to unlock basic features
- limit formatting unless you pay
- store your data on third-party platforms
- generate PDFs that break ATS parsing

This project takes a different approach:

- **Content-first**: your resume lives in a JSON file
- **ATS-first**: single column, clean text, no icons or tables
- **Reproducible**: same input always generates the same output
- **Offline & open-source**: no account, no tracking, no lock-in

If you can edit a JSON file, you can generate a professional ATS-compatible resume.

---

## How it works

1. You edit `data/resume.example.json`
2. The project renders it into a clean HTML resume
3. The HTML is exported to PDF using a headless browser
4. The final PDF preserves:
   - layout consistency
   - text structure for ATS
   - clickable links (`<a href>`)

---

## Project Structure

📦 cv-ats-html<br>
├─ 📁 templates<br>
│ ├─ 📄 ats.html # ATS-first HTML template (single column)<br>
│ └─ 📄 style.css # Print-safe, ATS-safe styles<br>
│<br>
├─ 📁 data<br>
│ └─ 📄 resume.example.json # Structured resume data (edit this file)<br>
│<br>
├─ 📁 scripts<br>
│ ├─ 📄 render.mjs # Renders JSON → HTML<br>
│ └─ 📄 export-pdf.mjs # Exports HTML → PDF (Playwright)<br>
│<br>
├─ 📁 dist # Generated output (gitignored)<br>
│ ├─ 📄 cv.html<br>
│ └─ 📄 cv.pdf<br>
│<br>
├─ 📄 package.json # Project scripts and dependencies<br>
├─ 📄 package-lock.json # Dependency lockfile<br>
├─ 📄 .gitignore # Ignores node_modules, dist, PDFs<br>
└─ 📄 README.md # Documentation and usage guide<br>

---

## Installation

Requirements:

- Node.js **18+**
- npm

Clone the repository and install dependencies:

```bash
npm install
```

Install Playwright browsers (required for PDF export):

```bash
npx playwright install
```

---

## Usage

1. Edit your resume data

Open and edit:
data/resume.example.json
This is the only file you need to change.

2. Generate HTML resume

```bash
npm run build
npm run build:letter
```

Output:

`dist/cover-letter/cv.html`

3. Generate PDF resume

```bash
npm run pdf
npm run pdf:letter
```

Output:
`dist/cover-letter/cv.pdf`

## The PDF:

- is A4-ready
- keeps links clickable
- is safe for ATS parsing
- is suitable for direct job applications

## Output Example

![Screenshot](data/cv-example.png)
