import type { VercelRequest, VercelResponse } from "@vercel/node";
import { redis } from "./redis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { clientId } = (req.body ?? {}) as { clientId?: string };
  if (!clientId) return res.status(400).json({ error: "clientId required" });

  const seenKey = `metrics:user_seen:${clientId}`;
  const wasSet = await redis.set(seenKey, "1", { nx: true });

  if (wasSet) await redis.incr("metrics:users_total");

  res.status(200).json({ ok: true, counted: Boolean(wasSet) });
}
