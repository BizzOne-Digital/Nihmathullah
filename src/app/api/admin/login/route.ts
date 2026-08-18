import { createSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { findAdminByEmail } from "@/lib/repositories/admin-users";
import { adminLoginSchema } from "@/lib/validation/admin";
import {
  handleApiError,
  jsonError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const { email, password } = parsed.data;
    const admin = await findAdminByEmail(email);

    if (!admin) {
      return jsonError("Invalid email or password", 401);
    }

    const valid = await verifyPassword(password, admin.passwordHash);

    if (!valid) {
      return jsonError("Invalid email or password", 401);
    }

    await createSession(admin._id.toString(), admin.email);

    return jsonResponse({
      success: true,
      user: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
