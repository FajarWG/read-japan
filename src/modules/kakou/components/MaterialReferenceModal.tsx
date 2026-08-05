"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@heroui/react";
import { CheckCircle2, PenLine } from "lucide-react";

import { CONJUGATION_FORMS } from "@/src/modules/katsuyou/data/conjugationForms";
import { CONJUGATION_GUIDES } from "@/src/modules/katsuyou/data/conjugationGuides";
import { CONJUGATION_EXAMPLES } from "@/src/modules/katsuyou/data/conjugationExamples";
import { MistakeCallout } from "@/src/modules/katsuyou/components/KatsuyouComponents";
import { ConjugationTableTab } from "@/src/modules/katsuyou/components/ConjugationTableTab";
import { BUNPOU_DATA } from "@/src/modules/bunpou/data/bunpouData";
import type { KakouMaterialSelection } from "../data/types";

interface MaterialReferenceModalProps {
  item: KakouMaterialSelection | null;
  completedLessons: string[];
  completedPatternIds: string[];
  onClose: () => void;
}

export function MaterialReferenceModal({
  item,
  completedLessons,
  completedPatternIds,
  onClose,
}: MaterialReferenceModalProps) {
  return (
    <Modal isOpen={Boolean(item)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop>
        <Modal.Container className="flex min-h-screen w-screen items-center justify-center p-4">
          <Modal.Dialog className="flex max-h-[90vh] w-full flex-col gap-3 overflow-y-auto rounded-3xl border border-border bg-background p-6 shadow-xl sm:max-w-2xl">
            <Modal.CloseTrigger />
            {item?.type === "KATSUYOU" && (
              <KatsuyouReference
                formKey={item.id}
                isCompleted={completedLessons.includes(item.id)}
                onClose={onClose}
              />
            )}
            {item?.type === "BUNPOU" && (
              <BunpouReference
                patternId={item.id}
                isLearned={completedPatternIds.includes(item.id)}
                onClose={onClose}
              />
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function KatsuyouReference({
  formKey,
  isCompleted,
  onClose,
}: {
  formKey: string;
  isCompleted: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"learn" | "examples" | "table">("learn");

  const form = CONJUGATION_FORMS.find((f) => f.key === formKey);
  const guide = CONJUGATION_GUIDES[formKey];
  const sentences = CONJUGATION_EXAMPLES[formKey] || [];

  if (!form) return null;

  return (
    <>
      <Modal.Header className="flex flex-col border-b border-border/20 pb-3">
        <p className="text-xs font-bold uppercase text-accent">Katsuyou · {form.jlpt}</p>
        <Modal.Heading className="font-jp text-lg font-bold text-foreground">
          {form.jpName} — {form.labelEn}
        </Modal.Heading>
      </Modal.Header>

      <div className="flex gap-4 border-b border-border/30">
        {(["learn", "examples", "table"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`cursor-pointer pb-2 text-xs font-bold transition-colors ${
              tab === t ? "border-b-2 border-accent text-accent" : "text-muted hover:text-foreground"
            }`}
          >
            {t === "learn" ? "Learn" : t === "examples" ? "Examples" : "Table"}
          </button>
        ))}
      </div>

      <Modal.Body className="flex flex-col gap-4 py-2">
        {tab === "learn" && guide && (
          <div className="flex flex-col gap-5">
            <p className="text-sm leading-relaxed text-foreground">{guide.purposeEn}</p>
            {[guide.rules.group1, guide.rules.group2, guide.rules.group3].map((group, i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface p-4">
                <p className="mb-2 text-xs font-bold text-muted">
                  {["Group 1 (Godan)", "Group 2 (Ichidan)", "Group 3 (Irregular)"][i]}
                </p>
                <p className="mb-2 text-xs text-muted">{group.patternEn}</p>
                <table className="w-full text-xs">
                  <tbody>
                    {group.examples.map((ex, idx) => (
                      <tr key={idx} className="border-t border-border/20">
                        <td className="py-1.5 font-jp text-foreground">{ex.base}</td>
                        <td className="py-1.5 font-jp text-accent">{ex.conj}</td>
                        <td className="py-1.5 text-muted">{ex.romaji}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            {guide.mistake && (
              <MistakeCallout
                titleEn={guide.mistake.titleEn}
                descEn={guide.mistake.descEn}
                examples={guide.mistake.examples}
              />
            )}
            <div className="flex justify-center pt-2">
              {isCompleted ? (
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-500">
                  <CheckCircle2 size={18} /> Practiced in Kakou
                </div>
              ) : (
                <p className="text-xs text-muted">Practice this in Kakou to mark it as learned.</p>
              )}
            </div>
          </div>
        )}

        {tab === "examples" && (
          <div className="flex flex-col gap-3">
            {sentences.length === 0 && <p className="text-xs italic text-muted">No examples available.</p>}
            {sentences.map((sen, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-4">
                <span className="text-[10px] text-muted">{sen.furigana}</span>
                <p className="font-jp text-base font-medium text-foreground">{sen.japanese}</p>
                <span className="text-xs italic text-muted">{sen.romaji}</span>
                <p className="border-t border-border/25 pt-2 text-sm text-foreground/70">{sen.indonesian}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "table" && <ConjugationTableTab formKey={formKey} />}
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-2 pt-2">
        <Link
          href={`/kakou?source=katsuyou&sourceId=${encodeURIComponent(formKey)}`}
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-95"
        >
          <PenLine size={14} /> Practice this in Kakou
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted hover:text-foreground"
        >
          Close
        </button>
      </Modal.Footer>
    </>
  );
}

function BunpouReference({
  patternId,
  isLearned,
  onClose,
}: {
  patternId: string;
  isLearned: boolean;
  onClose: () => void;
}) {
  let found: { lesson: (typeof BUNPOU_DATA)[number]; pattern: (typeof BUNPOU_DATA)[number]["patterns"][number] } | null = null;
  for (const lesson of BUNPOU_DATA) {
    const pattern = lesson.patterns.find((p) => p.id === patternId);
    if (pattern) {
      found = { lesson, pattern };
      break;
    }
  }

  if (!found) return null;
  const { lesson, pattern } = found;

  return (
    <>
      <Modal.Header className="flex flex-col border-b border-border/20 pb-3">
        <p className="text-xs font-bold uppercase text-accent">
          Bunpou · Chapter {lesson.chapter} · {pattern.jlpt}
        </p>
        <Modal.Heading className="font-jp text-lg font-bold text-foreground">{pattern.pattern}</Modal.Heading>
        <p className="mt-1 text-xs text-muted">{pattern.descEn}</p>
      </Modal.Header>

      <Modal.Body className="flex flex-col gap-3 py-3">
        {pattern.examples.map((ex, idx) => (
          <div key={idx} className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-4">
            <span className="text-[10px] text-muted">{ex.exampleKana}</span>
            <p className="font-jp text-base font-medium text-foreground">{ex.exampleJp}</p>
            <p className="border-t border-border/25 pt-2 text-sm text-foreground/70">{ex.exampleId}</p>
          </div>
        ))}

        <div className="flex justify-center">
          {isLearned ? (
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-500">
              <CheckCircle2 size={18} /> Practiced in Kakou
            </div>
          ) : (
            <p className="text-xs text-muted">Practice this in Kakou to mark it as learned.</p>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-2 pt-2">
        <Link
          href={`/kakou?source=bunpou&sourceId=${encodeURIComponent(patternId)}`}
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-95"
        >
          <PenLine size={14} /> Practice this in Kakou
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted hover:text-foreground"
        >
          Close
        </button>
      </Modal.Footer>
    </>
  );
}
