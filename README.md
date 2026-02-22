<div align="center">
<img src="packages/web/public/assets/images/banner-git-ats.png" alt="Logo" width="700" />

ATS-first resume builder focused on clarity, portability, and full control.

Create, edit, and export professional resumes using a clean visual editor.

<p>
  <img
    src="https://img.shields.io/github/package-json/v/fabriciotrinndade/ats-resume-generator-html?style=flat-square"
    alt="Version"
  />
  <img
    src="https://img.shields.io/github/stars/fabriciotrinndade/ats-resume-generator-html?style=flat-square"
    alt="GitHub Stars"
  />
  <img
    src="https://img.shields.io/github/last-commit/fabriciotrinndade/ats-resume-generator-html?style=flat-square"
    alt="Last commit"
  />
  <img
    src="https://img.shields.io/github/issues/fabriciotrinndade/ats-resume-generator-html?style=flat-square"
    alt="Open issues"
  />
  <a href="https://discord.gg/XjUaNnFf">
    <img
      src="https://img.shields.io/discord/1470457549659705405?style=flat-square&label=discord"
      alt="Discord"
    />
  </a>
</p>

</div>

---

ATS Flow is a lightweight and open-source resume builder designed for developers and technical professionals who want complete control over their resume without relying on paid builders or restrictive editors.

Use the visual editor to build your resume online, or edit structured JSON for full reproducibility.

## The system generates:

- clean ATS-friendly HTML

- print-ready PDF with clickable links

- structured JSON for portability

No subscriptions. No tracking. No lock-in.

## Why ATS Flow exists

Many resume builders:

- lock basic features behind paywalls

- store your data on third-party platforms

- generate PDFs that break ATS parsing

- prioritize visual layout over machine readability

ATS Flow takes a different approach:

- **ATS-first** — single column, clean structure, parser-friendly
- **Content-first** — your resume lives in structured data
- **Reproducible** — same input always generates the same output
- **Privacy-first** — no accounts, no tracking, no analytics
- **Open & portable** — export anytime, host anywhere

## Features

### Resume building
- Visual editor with live preview
- Import / export JSON resume data
- Real-time layout rendering
- One-click PDF export

### ATS optimization
- Single-column structure
- Clean semantic HTML
- Parser-friendly typography & spacing
- Clickable links preserved in PDF

### Privacy & control
- No account required
- Run locally (hosted PDF service optional)

## Output Example

Printable A4 PDF

<table>
   <tr>
      <td>
   <img src="packages/web/public/examples/cv-example.png" alt="Example" width="300" />
         </td>
      </tr>
</table>

## Quick Start

```bash
# Clone the repository
git clone https://github.com/fabriciotrinndade/ats-resume-generator-html

# Install dependencies
pnpm install

# Build internal packages (required)
pnpm -r build
```

Configure environment:

```bash
# Copy the example file
cp packages/web/.env.example packages/web/.env.local
```

Edit `packages/web/.env.local`:

```env
# Option A: local PDF service (Docker)
VITE_PDF_SERVICE_URL=http://localhost:3000

# Option B: hosted PDF service
# VITE_PDF_SERVICE_URL=https://your-service.onrender.com
```

Start the web editor:

```
pnpm -C packages/web dev
```

Open:

```
http://localhost:5173
```

Running PDF Export Locally (Docker):

```bash
# Build the image
docker build -t ats-pdf-service ./services/pdf

# Run the service
docker run --rm -p 3000:3000 ats-pdf-service
```

Using a Hosted PDF Service:

```VITE_PDF_SERVICE_URL=https://your-service.onrender.com```

No local setup required.

## Tech Stack

| Category	        | Technology                       |
| ---------------   | -------------------------------- |
| Frontend	        | React + Vite                     |
| Language	        | TypeScript + JavaScript          |
| Styling	        | Tailwind CSS                     |
| PDF Service       | Node.js + Express                |
| PDF Engine	     | Puppeteer Core                   |
| Headless          | Chromium	@sparticuz/chromium   |
| Package Manager	  | pnpm workspaces                  |
| Containerization  | Docker (pdf-service)             |
| Runtime	        | Node.js                          |

## Contributing

Contributions are welcome.

- Fork the repository

- Create a branch

- Commit your changes

- Open a Pull Request


