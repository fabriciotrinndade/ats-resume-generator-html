import { chromium } from "playwright";

/**
 * Exports rendered HTML to a PDF buffer using Playwright Chromium.
 * Returns the PDF as a Buffer (Node.js).
 */
export async function exportPdf(htmlContent: string): Promise<Buffer> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "load" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
}
