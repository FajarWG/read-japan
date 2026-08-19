import { redirect } from "next/navigation";
import { getSession } from "@/src/shared/lib/session";
import { AnkiAnalyticsContent } from "@/src/modules/anki/components/AnkiAnalyticsContent";

export default async function AnkiAnalyticsPage() {
  if (!(await getSession())) redirect("/login");
  return <AnkiAnalyticsContent />;
}
