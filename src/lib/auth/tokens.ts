import { createHash, randomBytes, timingSafeEqual } from "crypto";

export function generateSecureToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyToken(token: string, hash: string): boolean {
  const tokenHash = hashToken(token);

  try {
    const tokenBuffer = Buffer.from(tokenHash, "hex");
    const hashBuffer = Buffer.from(hash, "hex");

    if (tokenBuffer.length !== hashBuffer.length) {
      return false;
    }

    return timingSafeEqual(tokenBuffer, hashBuffer);
  } catch {
    return false;
  }
}
