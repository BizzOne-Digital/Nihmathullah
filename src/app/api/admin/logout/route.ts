import { destroySession } from "@/lib/auth/session";
import { jsonResponse } from "@/lib/api/response";

export async function POST() {
  await destroySession();
  return jsonResponse({ success: true });
}
