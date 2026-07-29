export interface SidebarForm {
  key: string;
  labelEn: string;
  labelId: string;
  jpName: string;
  jlpt: string;
  level: "basic" | "intermediate" | "advanced";
}

export const CONJUGATION_FORMS: SidebarForm[] = [
  { key: "dictionary", labelEn: "Dictionary Form", labelId: "Bentuk Kamus", jpName: "辞書形 (Jishokei)", jlpt: "N5", level: "basic" },
  { key: "masu", labelEn: "Masu Form", labelId: "Bentuk Masu", jpName: "ます形 (Masukei)", jlpt: "N5", level: "basic" },
  { key: "te", labelEn: "Te Form", labelId: "Bentuk Te", jpName: "て形 (Tekei)", jlpt: "N5+", level: "basic" },
  { key: "ta", labelEn: "Ta Form", labelId: "Bentuk Ta", jpName: "た形 (Takei)", jlpt: "N5+", level: "basic" },
  { key: "nai", labelEn: "Nai Form", labelId: "Bentuk Nai", jpName: "ない形 (Naikei)", jlpt: "N5+", level: "basic" },
  { key: "potential", labelEn: "Potential Form", labelId: "Bentuk Potensial", jpName: "可能形 (Kanoukei)", jlpt: "N4", level: "intermediate" },
  { key: "volitional", labelEn: "Volitional Form", labelId: "Bentuk Maksud", jpName: "意向形 (Ikoukei)", jlpt: "N4", level: "intermediate" },
  { key: "imperative", labelEn: "Imperative Form", labelId: "Bentuk Perintah", jpName: "命令形 (Meireikei)", jlpt: "N4", level: "intermediate" },
  { key: "prohibitive", labelEn: "Prohibitive Form", labelId: "Bentuk Larangan", jpName: "禁止形 (Kinshikei)", jlpt: "N4", level: "intermediate" },
  { key: "passive", labelEn: "Passive Form", labelId: "Bentuk Pasif", jpName: "受身形 (Ukemikei)", jlpt: "N3", level: "advanced" },
  { key: "causative", labelEn: "Causative Form", labelId: "Bentuk Kausatif", jpName: "使役形 (Shiekikei)", jlpt: "N3", level: "advanced" },
  { key: "causativePassive", labelEn: "Causative Passive", labelId: "Kausatif Pasif", jpName: "使役受身形 (Shiekiukemikei)", jlpt: "N3", level: "advanced" },
  { key: "ba", labelEn: "Conditional (Ba Form)", labelId: "Pengandaian (Bentuk Ba)", jpName: "ば形 (Bakei)", jlpt: "N3", level: "advanced" },
];
