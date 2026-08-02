const ENTITY_MAP: Record<string, string> = {
  "&n;": "noun",
  "&adj-i;": "i-adjective",
  "&adj-na;": "na-adjective",
  "&adj-no;": "no-adjective",
  "&adj-pn;": "adjectival pronoun",
  "&v1;": "Ichidan verb",
  "&v5k;": "Godan verb",
  "&v5s;": "Godan verb",
  "&v5t;": "Godan verb",
  "&v5n;": "Godan verb",
  "&v5m;": "Godan verb",
  "&v5r;": "Godan verb",
  "&v5g;": "Godan verb",
  "&v5b;": "Godan verb",
  "&v5u;": "Godan verb",
  "&vs;": "Suru verb",
  "&vk;": "Kuru verb",
  "&vt;": "transitive verb",
  "&vi;": "intransitive verb",
  "&exp;": "expression",
  "&pref;": "prefix",
  "&suf;": "suffix",
  "&adv;": "adverb",
  "&conj;": "conjunction",
  "&pn;": "pronoun",
  "&num;": "numeric",
  "&ctr;": "counter",
  "&int;": "interjection",
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
