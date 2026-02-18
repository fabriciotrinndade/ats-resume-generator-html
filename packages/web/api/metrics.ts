import type { VercelRequest, VercelResponse } from "@vercel/node";
import { redis } from "./redis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const [usersTotal, pdfsTotal] = await Promise.all([
    redis.get<number>("metrics:users_total"),
    redis.get<number>("metrics:pdfs_total"),
  ]);

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  return res.status(200).json({
    usersTotal: usersTotal ?? 0,
    pdfsTotal: pdfsTotal ?? 0,
  });
}
