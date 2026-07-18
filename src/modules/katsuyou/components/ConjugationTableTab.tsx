"use client";

import React, { useState, useMemo } from "react";
import { Search, Table2 } from "lucide-react";
import { mockVerbs } from "../data/verbs";
import { CONJUGATION_FORMS } from "./KatsuyouSidebar";
import { VerbGroupBadge, JLPTBadge } from "./KatsuyouComponents";

interface ConjugationTableTabProps {
  /** Currently selected sidebar form — highlighted in the table. */
  formKey: string;
}

export function ConjugationTableTab({ formKey }: ConjugationTableTabProps) {
  const [query, setQuery] = useState("");
  const [selectedVerbId, setSelectedVerbId] = useState<string>(
    mockVerbs.find((v) => v.id === "taberu")?.id || mockVerbs[0]?.id,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockVerbs;
    return mockVerbs.filter((v) =>
      [v.kanji, v.kana, v.romaji, v.english, v.indonesian]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  const verb = mockVerbs.find((v) => v.id === selectedVerbId) || mockVerbs[0];

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* ── Verb Picker ─────────────────────────────────── */}
      <div className="flex flex-col gap-3 border border-border/40 bg-surface/50 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-muted">
          <Table2 className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider select-none">
            Full Conjugation Table
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a verb (kanji, kana, romaji, meaning)..."
            className="w-full rounded-xl border border-border/50 bg-background pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:border-accent/40"
          />
        </div>

        {/* Verb chips list */}
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
          {filtered.length === 0 && (
            <span className="text-xs text-muted italic py-2">No verbs match your search.</span>
          )}
          {filtered.slice(0, 60).map((v) => {
            const active = v.id === selectedVerbId;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVerbId(v.id)}
                title={`${v.kana} — ${v.indonesian}`}
                className={[
                  "px-2.5 py-1 rounded-lg border text-xs font-jp font-bold transition cursor-pointer",
                  active
                    ? "bg-accent text-white border-accent"
                    : "bg-background border-border/40 text-foreground hover:bg-surface-muted",
                ].join(" ")}
              >
                {v.kanji}
              </button>
            );
          })}
          {filtered.length > 60 && (
            <span className="text-[10px] text-muted italic self-center px-1">
              +{filtered.length - 60} more — refine your search
            </span>
          )}
        </div>
      </div>

      {/* ── Selected Verb Header ────────────────────────── */}
      {verb && (
        <>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-xs">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[10px] text-muted font-semibold leading-none select-none">
                {verb.kana} • {verb.romaji}
              </span>
              <h3 className="text-2xl font-black font-jp text-foreground leading-tight">
                {verb.kanji}
              </h3>
              <span className="text-xs text-muted truncate">{verb.indonesian}</span>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <JLPTBadge level={verb.jlpt} />
              <VerbGroupBadge group={verb.group} />
            </div>
          </div>

          {/* ── Conjugation Table ─────────────────────────── */}
          <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border/45 text-muted select-none font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Form</th>
                  <th className="py-3 px-4">Kanji</th>
                  <th className="py-3 px-4">Kana</th>
                  <th className="py-3 px-4">Romaji</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/25">
                {CONJUGATION_FORMS.map((form) => {
                  const conj =
                    verb.conjugations[form.key as keyof typeof verb.conjugations];
                  if (!conj) return null;
                  const highlighted = form.key === formKey;
                  return (
                    <tr
                      key={form.key}
                      className={[
                        "transition-colors",
                        highlighted
                          ? "bg-accent/10"
                          : "hover:bg-surface-muted/30",
                      ].join(" ")}
                    >
                      <td className="py-2.5 px-4">
                        <div className="flex flex-col">
                          <span
                            className={[
                              "text-xs font-bold leading-tight",
                              highlighted ? "text-accent" : "text-foreground",
                            ].join(" ")}
                          >
                            {form.labelEn}
                          </span>
                          <span className="font-jp text-[10px] text-muted leading-tight">
                            {form.jpName}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-jp font-bold text-foreground select-all">
                        {conj.kanji}
                      </td>
                      <td className="py-2.5 px-4 font-jp text-muted select-all">
                        {conj.kana}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-muted italic">
                        {conj.romaji}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
