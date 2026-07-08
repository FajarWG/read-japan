export interface KotobaTerm {
  id: string;
  kanji: string;
  hiragana: string;
  romaji: string;
  /** Meaning in Indonesian — the primary gloss shown in the UI. */
  translationId: string;
  /** Meaning in English — kept for AI-import compatibility, not shown in UI. */
  translationEn: string;
  exampleJp: string;
  exampleKana: string;
  exampleTranslationId: string;
  exampleTranslationEn: string;
  isCustom?: boolean;
}

/**
 * Kotoba is a *personal* vocabulary notebook: it starts empty and the user
 * fills it with words they come across (via "Add Word", manual or AI import).
 * Everything the user adds is stored under `localStorage["kotoba_custom"]`.
 */
export const DEFAULT_KOTOBA_TERMS: KotobaTerm[] = [];
