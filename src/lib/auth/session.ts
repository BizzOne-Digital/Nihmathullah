import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "sierralink_admin_session";
const SESSION_DURATION_SECONDS = 24 * 60 * 60;

export interface SessionPayload {
  adminUserId: string;
  email: string;
}

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be set and at least 32 characters long"
    );
  }
  return new TextEncoder().encode(secret);
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export async function createSession(
  adminUserId: string,
  email: string
): Promise<void> {
  const token = await new SignJWT({ adminUserId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminUserId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getAuthSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

export async function verifySession(
  token?: string
): Promise<SessionPayload | null> {
  const sessionToken =
    token ?? (await cookies()).get(COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionToken, getAuthSecret());
    const adminUserId = payload.adminUserId ?? payload.sub;

    if (typeof adminUserId !== "string" || typeof payload.email !== "string") {
      return null;
    }

    return {
      adminUserId,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  return verifySession();
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
