import { redirect } from "next/navigation";

/**
 * Backward-compatibility: /read/[id] → /stories/read/[id]
 *
 * Redirect permanen agar link lama (bookmark, share URL, dll) tetap bekerja.
 */
export default async function ReadLegacyRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/stories/read/${id}`);
}