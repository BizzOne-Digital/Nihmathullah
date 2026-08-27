/** Client-side helper — calls admin delete API for stored uploads. */
export async function deleteStoredUploadByUrl(url: string): Promise<void> {
  if (!url.startsWith("/api/uploads/")) {
    return;
  }

  try {
    await fetch("/api/admin/uploads/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // Non-blocking for UI flows
  }
}
