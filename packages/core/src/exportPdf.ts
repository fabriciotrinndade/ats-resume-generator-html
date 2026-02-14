import { chromium as playwright } from "playwright-core";
import chromium from "@sparticuz/chromium";

export async function exportPdfFromHtml(html: string): Promise<Buffer> {
  const executablePath = await chromium.executablePath();

  const browser = await playwright.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
