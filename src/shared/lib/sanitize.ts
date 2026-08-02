import { translateSentenceToIndonesian } from "./translation";

const ENTITY_MAP: Record<string, string> = {
  "&n;": "kata benda (noun)",
  "&adj-i;": "kata sifat-i",
  "&adj-na;": "kata sifat-na",
  "&adj-no;": "kata sifat-no",
  "&adj-pn;": "pronomina sifat",
  "&v1;": "kata kerja Ichidan",
  "&v5k;": "kata kerja Godan",
  "&v5s;": "kata kerja Godan",
  "&v5t;": "kata kerja Godan",
  "&v5n;": "kata kerja Godan",
  "&v5m;": "kata kerja Godan",
  "&v5r;": "kata kerja Godan",
  "&v5g;": "kata kerja Godan",
  "&v5b;": "kata kerja Godan",
  "&v5u;": "kata kerja Godan",
  "&vs;": "kata kerja Suru",
  "&vk;": "kata kerja Kuru",
  "&vt;": "kata kerja transitif",
  "&vi;": "kata kerja intransitif",
  "&exp;": "ungkapan / ekspresi",
  "&pref;": "awalan (prefix)",
  "&suf;": "akhiran (suffix)",
  "&adv;": "kata keterangan (adverb)",
  "&conj;": "kata sambung",
  "&pn;": "kata ganti",
  "&num;": "angka / numerik",
  "&ctr;": "kata penggolong (counter)",
  "&int;": "kata seru",
};

export function cleanJMdictString(input: string): string {
  if (!input || typeof input !== "string") return "";

  let cleaned = input;

  // Replace known entity codes
  for (const [entity, replacement] of Object.entries(ENTITY_MAP)) {
    cleaned = cleaned.replaceAll(entity, replacement);
  }

  // Strip remaining XML entity codes like &something;
  cleaned = cleaned.replace(/&[a-zA-Z0-9_-]+;/g, "");

  // Strip HTML tags like <b>, </b>, <i>, </i>, <br>
  cleaned = cleaned.replace(/<[^>]*>/g, "");

  // Clean extra spaces
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Translate English gloss words to Indonesian
  cleaned = translateSentenceToIndonesian(cleaned);

  return cleaned;
}

export function cleanJMdictArray(items: any): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (typeof item === "string") return cleanJMdictString(item);
      if (item && item.glosses && Array.isArray(item.glosses)) {
        const cleanedGlosses = item.glosses.map(cleanJMdictString).filter(Boolean);
        const posText = item.pos && Array.isArray(item.pos)
          ? item.pos.map(cleanJMdictString).filter(Boolean).join(", ")
          : "";
        return posText ? `(${posText}) ${cleanedGlosses.join("; ")}` : cleanedGlosses.join("; ");
      }
      return "";
    })
    .filter(Boolean);
}
