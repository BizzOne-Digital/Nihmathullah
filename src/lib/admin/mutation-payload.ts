/** Map Mongo `_id` from admin UI forms to API `id` fields. */
export function toMutationPayload<T extends Record<string, unknown>>(
  record: T & { _id?: string }
): Record<string, unknown> {
  const { _id, ...rest } = record;
  if (_id) {
    return { ...rest, id: _id };
  }
  return rest;
}
