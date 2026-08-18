export type RepositoryErrorCode =
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "DATABASE"
  | "UNAUTHORIZED"
  | "CONFIGURATION";

export class RepositoryError extends Error {
  readonly code: RepositoryErrorCode;

  constructor(message: string, code: RepositoryErrorCode = "DATABASE") {
    super(message);
    this.name = "RepositoryError";
    this.code = code;
  }
}

export function handleRepositoryError(
  error: unknown,
  context: string
): never {
  if (error instanceof RepositoryError) {
    throw error;
  }

  console.error(`[Repository] ${context}:`, error);

  const detail =
    error instanceof Error ? error.message : "Unknown database error";
  const message =
    process.env.NODE_ENV === "development"
      ? `Failed to ${context}: ${detail}`
      : `Failed to ${context}`;

  throw new RepositoryError(message, "DATABASE");
}
