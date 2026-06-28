import { Verb, VerbConjugations } from "../data/verbs";

export interface SplitResult {
  stem: string;
  suffix: string;
}

export interface SplitConjugation {
  kanji: SplitResult;
  kana: SplitResult;
  romaji: SplitResult;
}

/**
 * Splits a verb conjugation form into its stem (root) and suffix (conjugated ending)
 * for Kanji, Kana, and Romaji representation.
 */
export function splitVerbConjugation(
  verb: Verb,
  formKey: keyof VerbConjugations
): SplitConjugation {
  const conj = verb.conjugations[formKey];
  if (!conj) {
    return {
      kanji: { stem: verb.kanji, suffix: "" },
      kana: { stem: verb.kana, suffix: "" },
      romaji: { stem: verb.romaji, suffix: "" },
    };
  }

  // 1. Group 3 Irregular Verbs (suru and kuru)
  if (verb.id === "kuru") {
    const stemsMap: Record<string, { kanji: string; kana: string; romaji: string }> = {
      dictionary: { kanji: "来", kana: "く", romaji: "ku" },
      masu: { kanji: "来", kana: "き", romaji: "ki" },
      te: { kanji: "来", kana: "き", romaji: "ki" },
      nai: { kanji: "来", kana: "こ", romaji: "ko" },
      ta: { kanji: "来", kana: "き", romaji: "ki" },
    };
    const stems = stemsMap[formKey] || { kanji: "来", kana: "こ", romaji: "ko" };
    return {
      kanji: { stem: stems.kanji, suffix: conj.kanji.slice(stems.kanji.length) },
      kana: { stem: stems.kana, suffix: conj.kana.slice(stems.kana.length) },
      romaji: { stem: stems.romaji, suffix: conj.romaji.slice(stems.romaji.length) },
    };
  }

  if (verb.id === "suru") {
    const stemsMap: Record<string, { kanji: string; kana: string; romaji: string }> = {
      dictionary: { kanji: "す", kana: "す", romaji: "su" },
      masu: { kanji: "し", kana: "し", romaji: "shi" },
      te: { kanji: "し", kana: "し", romaji: "shi" },
      nai: { kanji: "し", kana: "し", romaji: "shi" },
      ta: { kanji: "し", kana: "し", romaji: "shi" },
    };
    const stems = stemsMap[formKey] || { kanji: "し", kana: "し", romaji: "shi" };
    return {
      kanji: { stem: stems.kanji, suffix: conj.kanji.slice(stems.kanji.length) },
      kana: { stem: stems.kana, suffix: conj.kana.slice(stems.kana.length) },
      romaji: { stem: stems.romaji, suffix: conj.romaji.slice(stems.romaji.length) },
    };
  }

  // 2. Group 2 (Ichidan) Verbs (ends in -iru/-eru, ends with る)
  if (verb.group === 2) {
    const kanjiStem = verb.kanji.slice(0, -1);
    const kanaStem = verb.kana.slice(0, -1);
    const romajiStem = verb.romaji.slice(0, -2); // remove "ru"

    return {
      kanji: { stem: kanjiStem, suffix: conj.kanji.slice(kanjiStem.length) },
      kana: { stem: kanaStem, suffix: conj.kana.slice(kanaStem.length) },
      romaji: { stem: romajiStem, suffix: conj.romaji.slice(romajiStem.length) },
    };
  }

  // 3. Group 1 (Godan) Verbs
  // For Godan, Kanji & Kana stems are always dictionary form minus the last character.
  const kanjiStem = verb.kanji.slice(0, -1);
  const kanaStem = verb.kana.slice(0, -1);

  // For Romaji stem: depends on subGroup / dictionary ending
  let romajiStemLength = verb.romaji.length - 2; // default: remove 2 letters (e.g. ku, su, ru, mu, bu, nu, gu)
  if (verb.subGroup === "u") {
    romajiStemLength = verb.romaji.length - 1; // e.g. kau -> ka + u
  } else if (verb.subGroup === "tsu") {
    romajiStemLength = verb.romaji.length - 3; // e.g. matsu -> ma + tsu
  }
  const romajiStem = verb.romaji.slice(0, romajiStemLength);

  return {
    kanji: { stem: kanjiStem, suffix: conj.kanji.slice(kanjiStem.length) },
    kana: { stem: kanaStem, suffix: conj.kana.slice(kanaStem.length) },
    romaji: { stem: romajiStem, suffix: conj.romaji.slice(romajiStem.length) },
  };
}
