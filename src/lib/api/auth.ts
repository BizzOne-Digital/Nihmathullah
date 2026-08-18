import { getSession, type SessionPayload } from "@/lib/auth/session";
import { jsonError } from "./response";

export async function requireApiAdmin(): Promise<SessionPayload | Response> {
  const session = await getSession();
  if (!session) {
    return jsonError("Unauthorized", 401);
  }
  return session;
}

export function isAuthResponse(
  result: SessionPayload | Response
): result is Response {
  return result instanceof Response;
}
