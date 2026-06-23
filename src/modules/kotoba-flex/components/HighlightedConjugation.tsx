import React from "react";
import { Verb, VerbConjugations } from "../data/verbs";
import { splitVerbConjugation } from "../utils/conjugationSplitter";

interface HighlightedConjugationProps {
  verb: Verb;
  formKey: keyof VerbConjugations;
  textType: "kanji" | "kana" | "romaji";
  className?: string;
  highlightClass?: string;
}

export function HighlightedConjugation({
  verb,
  formKey,
  textType,
  className = "",
  highlightClass = "text-accent font-bold",
}: HighlightedConjugationProps) {
  try {
    const { stem, suffix } = splitVerbConjugation(verb, formKey)[textType];

    return (
      <span className={className}>
        <span>{stem}</span>
        <span className={highlightClass}>{suffix}</span>
      </span>
    );
  } catch (error) {
    // Fallback if parsing fails
    const text = verb.conjugations[formKey][textType];
    return <span className={className}>{text}</span>;
  }
}
