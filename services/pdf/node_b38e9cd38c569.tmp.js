import express from "express";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import cors from "cors";

const app = express();

app.use(cors({ origin: true }));
app.options("*", cors());

app.use(express.json({ limit: "15mb" }));

app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

app.post("/export-pdf", async (req, res) => {
  let browser;

  try {
    const html = req.body?.html;
    if (typeof html !== "string" || !html.trim()) {
      return res.status(400).json({ error: "Missing html" });
    }

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="cv.pdf"',
      "Content-Length": pdfBuffer.length,
      "Cache-Control": "no-store",
    });

    res.end(pdfBuffer);
  } catch (e) {
    res.status(500).json({
      error: "PDF export failed",
      details: String(e?.stack || e),
    });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`pdf-service listening on :${port}`));
  