// Verify a Watch webhook signature (Node 18+). MIT licensed.
// Header: X-Watch-Signature: t=UNIX,v1=HEX ; HEX = HMAC-SHA256(secret, t + "." + rawBody)
import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyWatchSignature(rawBody, header, secret, toleranceSec = 300) {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=")));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const want = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  const got = parts.v1 || "";
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}
