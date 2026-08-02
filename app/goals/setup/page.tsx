import React from "react";
import { GoalSetupWizard } from "@/src/modules/goals/components/GoalSetupWizard";

export const dynamic = "force-dynamic";

export default function GoalSetupPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <GoalSetupWizard />
    </div>
  );
}
