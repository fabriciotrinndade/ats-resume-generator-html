import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const raw = req.body;
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;

    // dynamic import para não cair em require() de ESM
    const { buildHtml, exportPdfFromHtml } =
      await import("../packages/core/src/server");

    const html = await buildHtml(data);
    const pdfBytes: Uint8Array = await exportPdfFromHtml(html);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="cv.pdf"');
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (e: any) {
    res.status(500).json({
      error: "PDF export failed",
      details: String(e?.message ?? e),
    });
  }
}
