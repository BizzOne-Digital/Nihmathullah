import { RepositoryError } from "@/lib/repositories/errors";
import { ZodError } from "zod";

export function jsonResponse<T>(data: T, status = 200): Response {
  return Response.json(data, { status });
}

export function jsonError(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

export function zodErrorResponse(error: ZodError): Response {
  const firstIssue = error.issues[0];
  const message = firstIssue?.message ?? "Validation failed";
  return Response.json(
    {
      error: message,
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    },
    { status: 400 }
  );
}

export function handleApiError(error: unknown): Response {
  if (error instanceof RepositoryError) {
    switch (error.code) {
      case "NOT_FOUND":
        return jsonError(error.message, 404);
      case "VALIDATION":
        return jsonError(error.message, 400);
      case "CONFLICT":
        return jsonError(error.message, 409);
      case "UNAUTHORIZED":
        return jsonError(error.message, 401);
      case "CONFIGURATION":
        return jsonError(error.message, 503);
      default:
        console.error("[API]", error);
        return jsonError("An unexpected error occurred", 500);
    }
  }

  console.error("[API]", error);
  return jsonError("An unexpected error occurred", 500);
}
