import express from "express";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const app = express();
app.use(express.json({ limit: "15mb" }));

app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

app.post("/export-pdf", async (req, res) => {
  try {
    const html = req.body?.html;
    if (typeof html !== "string" || !html.trim()) {
      return res.status(400).json({ error: "Missing html" });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.status(200).send(pdf);
  } catch (e) {
    res.status(500).json({
      error: "PDF export failed",
      details: String(e?.stack || e),
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`pdf-service listening on :${port}`));
