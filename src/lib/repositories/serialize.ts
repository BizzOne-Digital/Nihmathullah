import { serializeDoc } from "@/lib/utils";

export function toPlainDoc(doc: unknown): Record<string, unknown> {
  if (doc == null) {
    return {};
  }

  if (
    typeof doc === "object" &&
    doc !== null &&
    "toObject" in doc &&
    typeof (doc as { toObject: unknown }).toObject === "function"
  ) {
    return (doc as { toObject: () => Record<string, unknown> }).toObject();
  }

  return serializeDoc(doc) as Record<string, unknown>;
}

export function mapRepositoryDoc<T>(doc: unknown): T {
  return serializeDoc(toPlainDoc(doc)) as unknown as T;
}
