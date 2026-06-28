export interface ConjugationForm {
  kanji: string;
  kana: string;
  romaji: string;
}

export interface VerbConjugations {
  dictionary?: ConjugationForm;
  masu: ConjugationForm;
  te: ConjugationForm;
  ta: ConjugationForm;
  nai: ConjugationForm;
  potential: ConjugationForm;
  volitional: ConjugationForm;
  imperative: ConjugationForm;
  prohibitive: ConjugationForm;
  passive: ConjugationForm;
  causative: ConjugationForm;
  causativePassive: ConjugationForm;
  ba: ConjugationForm;
}

export interface Verb {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  english: string;
  indonesian: string;
  jlpt: "N5" | "N4" | "N3" | "N2";
  group: 1 | 2 | 3;
  subGroup?: string;
  conjugations: VerbConjugations;
}

export const mockVerbs: Verb[] = [
  {
    "id": "suru",
    "kanji": "する",
    "kana": "する",
    "romaji": "suru",
    "english": "to do",
    "indonesian": "melakukan",
    "jlpt": "N5",
    "group": 3,
    "subGroup": "irregular",
    "conjugations": {
      "dictionary": {
        "kanji": "する",
        "kana": "する",
        "romaji": "suru"
      },
      "masu": {
        "kanji": "します",
        "kana": "します",
        "romaji": "shimasu"
      },
      "te": {
        "kanji": "して",
        "kana": "して",
        "romaji": "shite"
      },
      "ta": {
        "kanji": "した",
        "kana": "した",
        "romaji": "shita"
      },
      "nai": {
        "kanji": "しない",
        "kana": "しない",
        "romaji": "shinai"
      },
      "potential": {
        "kanji": "できる",
        "kana": "できる",
        "romaji": "dekiru"
      },
      "volitional": {
        "kanji": "しよう",
        "kana": "しよう",
        "romaji": "shiyou"
      },
      "imperative": {
        "kanji": "しろ",
        "kana": "しろ",
        "romaji": "shiro"
      },
      "prohibitive": {
        "kanji": "するな",
        "kana": "するな",
        "romaji": "suruna"
      },
      "passive": {
        "kanji": "される",
        "kana": "される",
        "romaji": "sareru"
      },
      "causative": {
        "kanji": "させる",
        "kana": "させる",
        "romaji": "saseru"
      },
      "causativePassive": {
        "kanji": "させられる",
        "kana": "させられる",
        "romaji": "saserareru"
      },
      "ba": {
        "kanji": "すれば",
        "kana": "すれば",
        "romaji": "sureba"
      }
    }
  },
  {
    "id": "kuru",
    "kanji": "来る",
    "kana": "くる",
    "romaji": "kuru",
    "english": "to come",
    "indonesian": "datang",
    "jlpt": "N5",
    "group": 3,
    "subGroup": "irregular",
    "conjugations": {
      "dictionary": {
        "kanji": "来る",
        "kana": "くる",
        "romaji": "kuru"
      },
      "masu": {
        "kanji": "来ます",
        "kana": "きます",
        "romaji": "kimasu"
      },
      "te": {
        "kanji": "来て",
        "kana": "きて",
        "romaji": "kite"
      },
      "ta": {
        "kanji": "来た",
        "kana": "きた",
        "romaji": "kita"
      },
      "nai": {
        "kanji": "来ない",
        "kana": "こない",
        "romaji": "konai"
      },
      "potential": {
        "kanji": "来られる",
        "kana": "こられる",
        "romaji": "korareru"
      },
      "volitional": {
        "kanji": "来よう",
        "kana": "こよう",
        "romaji": "koyou"
      },
      "imperative": {
        "kanji": "来い",
        "kana": "こい",
        "romaji": "koi"
      },
      "prohibitive": {
        "kanji": "来るな",
        "kana": "くるな",
        "romaji": "kuruna"
      },
      "passive": {
        "kanji": "来られる",
        "kana": "こられる",
        "romaji": "korareru"
      },
      "causative": {
        "kanji": "来させる",
        "kana": "こさせる",
        "romaji": "kosaseru"
      },
      "causativePassive": {
        "kanji": "来させられる",
        "kana": "こさせられる",
        "romaji": "kosaserareru"
      },
      "ba": {
        "kanji": "来れば",
        "kana": "くれば",
        "romaji": "kureba"
      }
    }
  },
  {
    "id": "benkyousuru",
    "kanji": "勉強する",
    "kana": "べんきょうする",
    "romaji": "benkyousuru",
    "english": "to study",
    "indonesian": "belajar",
    "jlpt": "N5",
    "group": 3,
    "subGroup": "irregular",
    "conjugations": {
      "dictionary": {
        "kanji": "勉強する",
        "kana": "べんきょうする",
        "romaji": "benkyousuru"
      },
      "masu": {
        "kanji": "勉強します",
        "kana": "べんきょします",
        "romaji": "benkyoushimasu"
      },
      "te": {
        "kanji": "勉強して",
        "kana": "べんきょして",
        "romaji": "benkyoushite"
      },
      "ta": {
        "kanji": "勉強した",
        "kana": "べんきょした",
        "romaji": "benkyoushita"
      },
      "nai": {
        "kanji": "勉強しない",
        "kana": "べんきょしない",
        "romaji": "benkyoushinai"
      },
      "potential": {
        "kanji": "勉強できる",
        "kana": "べんきょできる",
        "romaji": "benkyoudekiru"
      },
      "volitional": {
        "kanji": "勉強しよう",
        "kana": "べんきょしよう",
        "romaji": "benkyoushiyou"
      },
      "imperative": {
        "kanji": "勉強しろ",
        "kana": "べんきょしろ",
        "romaji": "benkyoushiro"
      },
      "prohibitive": {
        "kanji": "勉強するな",
        "kana": "べんきょするな",
        "romaji": "benkyousuruna"
      },
      "passive": {
        "kanji": "勉強される",
        "kana": "べんきょされる",
        "romaji": "benkyousareru"
      },
      "causative": {
        "kanji": "勉強させる",
        "kana": "べんきょさせる",
        "romaji": "benkyousaseru"
      },
      "causativePassive": {
        "kanji": "勉強させられる",
        "kana": "べんきょさせられる",
        "romaji": "benkyousaserareru"
      },
      "ba": {
        "kanji": "勉強すれば",
        "kana": "べんきょすれば",
        "romaji": "benkyousureba"
      }
    }
  },
  {
    "id": "untensuru",
    "kanji": "運転する",
    "kana": "うんてんする",
    "romaji": "untensuru",
    "english": "to drive",
    "indonesian": "menyetir",
    "jlpt": "N4",
    "group": 3,
    "subGroup": "irregular",
    "conjugations": {
      "dictionary": {
        "kanji": "運転する",
        "kana": "うんてんする",
        "romaji": "untensuru"
      },
      "masu": {
        "kanji": "運転します",
        "kana": "うんてします",
        "romaji": "untenshimasu"
      },
      "te": {
        "kanji": "運転して",
        "kana": "うんてして",
        "romaji": "untenshite"
      },
      "ta": {
        "kanji": "運転した",
        "kana": "うんてした",
        "romaji": "untenshita"
      },
      "nai": {
        "kanji": "運転しない",
        "kana": "うんてしない",
        "romaji": "untenshinai"
      },
      "potential": {
        "kanji": "運転できる",
        "kana": "うんてできる",
        "romaji": "untendekiru"
      },
      "volitional": {
        "kanji": "運転しよう",
        "kana": "うんてしよう",
        "romaji": "untenshiyou"
      },
      "imperative": {
        "kanji": "運転しろ",
        "kana": "うんてしろ",
        "romaji": "untenshiro"
      },
      "prohibitive": {
        "kanji": "運転するな",
        "kana": "うんてするな",
        "romaji": "untensuruna"
      },
      "passive": {
        "kanji": "運転される",
        "kana": "うんてされる",
        "romaji": "untensareru"
      },
      "causative": {
        "kanji": "運転させる",
        "kana": "うんてさせる",
        "romaji": "untensaseru"
      },
      "causativePassive": {
        "kanji": "運転させられる",
        "kana": "うんてさせられる",
        "romaji": "untensaserareru"
      },
      "ba": {
        "kanji": "運転すれば",
        "kana": "うんてすれば",
        "romaji": "untensureba"
      }
    }
  },
  {
    "id": "renshuusuru",
    "kanji": "練習する",
    "kana": "れんしゅうする",
    "romaji": "renshuusuru",
    "english": "to practice",
    "indonesian": "berlatih",
    "jlpt": "N4",
    "group": 3,
    "subGroup": "irregular",
    "conjugations": {
      "dictionary": {
        "kanji": "練習する",
        "kana": "れんしゅうする",
        "romaji": "renshuusuru"
      },
      "masu": {
        "kanji": "練習します",
        "kana": "れんしゅします",
        "romaji": "renshuushimasu"
      },
      "te": {
        "kanji": "練習して",
        "kana": "れんしゅして",
        "romaji": "renshuushite"
      },
      "ta": {
        "kanji": "練習した",
        "kana": "れんしゅした",
        "romaji": "renshuushita"
      },
      "nai": {
        "kanji": "練習しない",
        "kana": "れんしゅしない",
        "romaji": "renshuushinai"
      },
      "potential": {
        "kanji": "練習できる",
        "kana": "れんしゅできる",
        "romaji": "renshuudekiru"
      },
      "volitional": {
        "kanji": "練習しよう",
        "kana": "れんしゅしよう",
        "romaji": "renshuushiyou"
      },
      "imperative": {
        "kanji": "練習しろ",
        "kana": "れんしゅしろ",
        "romaji": "renshuushiro"
      },
      "prohibitive": {
        "kanji": "練習するな",
        "kana": "れんしゅするな",
        "romaji": "renshuusuruna"
      },
      "passive": {
        "kanji": "練習される",
        "kana": "れんしゅされる",
        "romaji": "renshuusareru"
      },
      "causative": {
        "kanji": "練習させる",
        "kana": "れんしゅさせる",
        "romaji": "renshuusaseru"
      },
      "causativePassive": {
        "kanji": "練習させられる",
        "kana": "れんしゅさせられる",
        "romaji": "renshuusaserareru"
      },
      "ba": {
        "kanji": "練習すれば",
        "kana": "れんしゅすれば",
        "romaji": "renshuusureba"
      }
    }
  },
  {
    "id": "soujisuru",
    "kanji": "掃除する",
    "kana": "そうじする",
    "romaji": "soujisuru",
    "english": "to clean",
    "indonesian": "membersihkan",
    "jlpt": "N5",
    "group": 3,
    "subGroup": "irregular",
    "conjugations": {
      "dictionary": {
        "kanji": "掃除する",
        "kana": "そうじする",
        "romaji": "soujisuru"
      },
      "masu": {
        "kanji": "掃除します",
        "kana": "そうします",
        "romaji": "soujishimasu"
      },
      "te": {
        "kanji": "掃除して",
        "kana": "そうして",
        "romaji": "soujishite"
      },
      "ta": {
        "kanji": "掃除した",
        "kana": "そうした",
        "romaji": "soujishita"
      },
      "nai": {
        "kanji": "掃除しない",
        "kana": "そうしない",
        "romaji": "soujishinai"
      },
      "potential": {
        "kanji": "掃除できる",
        "kana": "そうできる",
        "romaji": "soujidekiru"
      },
      "volitional": {
        "kanji": "掃除しよう",
        "kana": "そうしよう",
        "romaji": "soujishiyou"
      },
      "imperative": {
        "kanji": "掃除しろ",
        "kana": "そうしろ",
        "romaji": "soujishiro"
      },
      "prohibitive": {
        "kanji": "掃除するな",
        "kana": "そうするな",
        "romaji": "soujisuruna"
      },
      "passive": {
        "kanji": "掃除される",
        "kana": "そうされる",
        "romaji": "soujisareru"
      },
      "causative": {
        "kanji": "掃除させる",
        "kana": "そうさせる",
        "romaji": "soujisaseru"
      },
      "causativePassive": {
        "kanji": "掃除させられる",
        "kana": "そうさせられる",
        "romaji": "soujisaserareru"
      },
      "ba": {
        "kanji": "掃除すれば",
        "kana": "そうすれば",
        "romaji": "soujisureba"
      }
    }
  },
  {
    "id": "sentakusuru",
    "kanji": "洗濯する",
    "kana": "せんたくする",
    "romaji": "sentakusuru",
    "english": "to wash clothes",
    "indonesian": "mencuci pakaian",
    "jlpt": "N5",
    "group": 3,
    "subGroup": "irregular",
    "conjugations": {
      "dictionary": {
        "kanji": "洗濯する",
        "kana": "せんたくする",
        "romaji": "sentakusuru"
      },
      "masu": {
        "kanji": "洗濯します",
        "kana": "せんたします",
        "romaji": "sentakushimasu"
      },
      "te": {
        "kanji": "洗濯して",
        "kana": "せんたして",
        "romaji": "sentakushite"
      },
      "ta": {
        "kanji": "洗濯した",
        "kana": "せんたした",
        "romaji": "sentakushita"
      },
      "nai": {
        "kanji": "洗濯しない",
        "kana": "せんたしない",
        "romaji": "sentakushinai"
      },
      "potential": {
        "kanji": "洗濯できる",
        "kana": "せんたできる",
        "romaji": "sentakudekiru"
      },
      "volitional": {
        "kanji": "洗濯しよう",
        "kana": "せんたしよう",
        "romaji": "sentakushiyou"
      },
      "imperative": {
        "kanji": "洗濯しろ",
        "kana": "せんたしろ",
        "romaji": "sentakushiro"
      },
      "prohibitive": {
        "kanji": "洗濯するな",
        "kana": "せんたするな",
        "romaji": "sentakusuruna"
      },
      "passive": {
        "kanji": "洗濯される",
        "kana": "せんたされる",
        "romaji": "sentakusareru"
      },
      "causative": {
        "kanji": "洗濯させる",
        "kana": "せんたさせる",
        "romaji": "sentakusaseru"
      },
      "causativePassive": {
        "kanji": "洗濯させられる",
        "kana": "せんたさせられる",
        "romaji": "sentakusaserareru"
      },
      "ba": {
        "kanji": "洗濯すれば",
        "kana": "せんたすれば",
        "romaji": "sentakusureba"
      }
    }
  },
  {
    "id": "ryokousuru",
    "kanji": "旅行する",
    "kana": "りょこうする",
    "romaji": "ryokousuru",
    "english": "to travel",
    "indonesian": "bepergian",
    "jlpt": "N4",
    "group": 3,
    "subGroup": "irregular",
    "conjugations": {
      "dictionary": {
        "kanji": "旅行する",
        "kana": "りょこうする",
        "romaji": "ryokousuru"
      },
      "masu": {
        "kanji": "旅行します",
        "kana": "りょこします",
        "romaji": "ryokoushimasu"
      },
      "te": {
        "kanji": "旅行して",
        "kana": "りょこして",
        "romaji": "ryokoushite"
      },
      "ta": {
        "kanji": "旅行した",
        "kana": "りょこした",
        "romaji": "ryokoushita"
      },
      "nai": {
        "kanji": "旅行しない",
        "kana": "りょこしない",
        "romaji": "ryokoushinai"
      },
      "potential": {
        "kanji": "旅行できる",
        "kana": "りょこできる",
        "romaji": "ryokoudekiru"
      },
      "volitional": {
        "kanji": "旅行しよう",
        "kana": "りょこしよう",
        "romaji": "ryokoushiyou"
      },
      "imperative": {
        "kanji": "旅行しろ",
        "kana": "りょこしろ",
        "romaji": "ryokoushiro"
      },
      "prohibitive": {
        "kanji": "旅行するな",
        "kana": "りょこするな",
        "romaji": "ryokousuruna"
      },
      "passive": {
        "kanji": "旅行される",
        "kana": "りょこされる",
        "romaji": "ryokousareru"
      },
      "causative": {
        "kanji": "旅行させる",
        "kana": "りょこさせる",
        "romaji": "ryokousaseru"
      },
      "causativePassive": {
        "kanji": "旅行させられる",
        "kana": "りょこさせられる",
        "romaji": "ryokousaserareru"
      },
      "ba": {
        "kanji": "旅行すれば",
        "kana": "りょこすれば",
        "romaji": "ryokousureba"
      }
    }
  },
  {
    "id": "shoukaisturu",
    "kanji": "紹介する",
    "kana": "しょうかいする",
    "romaji": "shoukaisuru",
    "english": "to introduce",
    "indonesian": "memperkenalkan",
    "jlpt": "N4",
    "group": 3,
    "subGroup": "irregular",
    "conjugations": {
      "dictionary": {
        "kanji": "紹介する",
        "kana": "しょうかいする",
        "romaji": "shoukaisuru"
      },
      "masu": {
        "kanji": "紹介します",
        "kana": "しょうかします",
        "romaji": "shoukaishimasu"
      },
      "te": {
        "kanji": "紹介して",
        "kana": "しょうかして",
        "romaji": "shoukaishite"
      },
      "ta": {
        "kanji": "紹介した",
        "kana": "しょうかした",
        "romaji": "shoukaishita"
      },
      "nai": {
        "kanji": "紹介しない",
        "kana": "しょうかしない",
        "romaji": "shoukaishinai"
      },
      "potential": {
        "kanji": "紹介できる",
        "kana": "しょうかできる",
        "romaji": "shoukaidekiru"
      },
      "volitional": {
        "kanji": "紹介しよう",
        "kana": "しょうかしよう",
        "romaji": "shoukaishiyou"
      },
      "imperative": {
        "kanji": "紹介しろ",
        "kana": "しょうかしろ",
        "romaji": "shoukaishiro"
      },
      "prohibitive": {
        "kanji": "紹介するな",
        "kana": "しょうかするな",
        "romaji": "shoukaisuruna"
      },
      "passive": {
        "kanji": "紹介される",
        "kana": "しょうかされる",
        "romaji": "shoukaisareru"
      },
      "causative": {
        "kanji": "紹介させる",
        "kana": "しょうかさせる",
        "romaji": "shoukaisaseru"
      },
      "causativePassive": {
        "kanji": "紹介させられる",
        "kana": "しょうかさせられる",
        "romaji": "shoukaisaserareru"
      },
      "ba": {
        "kanji": "紹介すれば",
        "kana": "しょうかすれば",
        "romaji": "shoukaisureba"
      }
    }
  },
  {
    "id": "shitsumonsuru",
    "kanji": "質問する",
    "kana": "しつもんする",
    "romaji": "shitsumonsuru",
    "english": "to ask questions",
    "indonesian": "bertanya",
    "jlpt": "N5",
    "group": 3,
    "subGroup": "irregular",
    "conjugations": {
      "dictionary": {
        "kanji": "質問する",
        "kana": "しつもんする",
        "romaji": "shitsumonsuru"
      },
      "masu": {
        "kanji": "質問します",
        "kana": "しつもします",
        "romaji": "shitsumonshimasu"
      },
      "te": {
        "kanji": "質問して",
        "kana": "しつもして",
        "romaji": "shitsumonshite"
      },
      "ta": {
        "kanji": "質問した",
        "kana": "しつもした",
        "romaji": "shitsumonshita"
      },
      "nai": {
        "kanji": "質問しない",
        "kana": "しつもしない",
        "romaji": "shitsumonshinai"
      },
      "potential": {
        "kanji": "質問できる",
        "kana": "しつもできる",
        "romaji": "shitsumondekiru"
      },
      "volitional": {
        "kanji": "質問しよう",
        "kana": "しつもしよう",
        "romaji": "shitsumonshiyou"
      },
      "imperative": {
        "kanji": "質問しろ",
        "kana": "しつもしろ",
        "romaji": "shitsumonshiro"
      },
      "prohibitive": {
        "kanji": "質問するな",
        "kana": "しつもするな",
        "romaji": "shitsumonsuruna"
      },
      "passive": {
        "kanji": "質問される",
        "kana": "しつもされる",
        "romaji": "shitsumonsareru"
      },
      "causative": {
        "kanji": "質問させる",
        "kana": "しつもさせる",
        "romaji": "shitsumonsaseru"
      },
      "causativePassive": {
        "kanji": "質問させられる",
        "kana": "しつもさせられる",
        "romaji": "shitsumonsaserareru"
      },
      "ba": {
        "kanji": "質問すれば",
        "kana": "しつもすれば",
        "romaji": "shitsumonsureba"
      }
    }
  },
  {
    "id": "taberu",
    "kanji": "食べる",
    "kana": "たべる",
    "romaji": "taberu",
    "english": "to eat",
    "indonesian": "makan",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "食べる",
        "kana": "たべる",
        "romaji": "taberu"
      },
      "masu": {
        "kanji": "食べます",
        "kana": "たべます",
        "romaji": "tabemasu"
      },
      "te": {
        "kanji": "食べて",
        "kana": "たべて",
        "romaji": "tabete"
      },
      "ta": {
        "kanji": "食べた",
        "kana": "たべた",
        "romaji": "tabeta"
      },
      "nai": {
        "kanji": "食べない",
        "kana": "たべない",
        "romaji": "tabenai"
      },
      "potential": {
        "kanji": "食べられる",
        "kana": "たべられる",
        "romaji": "taberareru"
      },
      "volitional": {
        "kanji": "食べよう",
        "kana": "たべよう",
        "romaji": "tabeyou"
      },
      "imperative": {
        "kanji": "食べろ",
        "kana": "たべろ",
        "romaji": "tabero"
      },
      "prohibitive": {
        "kanji": "食べるな",
        "kana": "たべるな",
        "romaji": "taberuna"
      },
      "passive": {
        "kanji": "食べられる",
        "kana": "たべられる",
        "romaji": "taberareru"
      },
      "causative": {
        "kanji": "食べさせる",
        "kana": "たべさせる",
        "romaji": "tabesaseru"
      },
      "causativePassive": {
        "kanji": "食べさせられる",
        "kana": "たべさせられる",
        "romaji": "tabesaserareru"
      },
      "ba": {
        "kanji": "食べれば",
        "kana": "たべれば",
        "romaji": "tabereba"
      }
    }
  },
  {
    "id": "okiru",
    "kanji": "起きる",
    "kana": "おきる",
    "romaji": "okiru",
    "english": "to wake up",
    "indonesian": "bangun tidur",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "起きる",
        "kana": "おきる",
        "romaji": "okiru"
      },
      "masu": {
        "kanji": "起きます",
        "kana": "おきます",
        "romaji": "okimasu"
      },
      "te": {
        "kanji": "起きて",
        "kana": "おきて",
        "romaji": "okite"
      },
      "ta": {
        "kanji": "起きた",
        "kana": "おきた",
        "romaji": "okita"
      },
      "nai": {
        "kanji": "起きない",
        "kana": "おきない",
        "romaji": "okinai"
      },
      "potential": {
        "kanji": "起きられる",
        "kana": "おきられる",
        "romaji": "okirareru"
      },
      "volitional": {
        "kanji": "起きよう",
        "kana": "おきよう",
        "romaji": "okiyou"
      },
      "imperative": {
        "kanji": "起きろ",
        "kana": "おきろ",
        "romaji": "okiro"
      },
      "prohibitive": {
        "kanji": "起きるな",
        "kana": "おきるな",
        "romaji": "okiruna"
      },
      "passive": {
        "kanji": "起きられる",
        "kana": "おきられる",
        "romaji": "okirareru"
      },
      "causative": {
        "kanji": "起きさせる",
        "kana": "おきさせる",
        "romaji": "okisaseru"
      },
      "causativePassive": {
        "kanji": "起きさせられる",
        "kana": "おきさせられる",
        "romaji": "okisaserareru"
      },
      "ba": {
        "kanji": "起きれば",
        "kana": "おきれば",
        "romaji": "okireba"
      }
    }
  },
  {
    "id": "neru",
    "kanji": "寝る",
    "kana": "ねる",
    "romaji": "neru",
    "english": "to sleep",
    "indonesian": "tidur",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "寝る",
        "kana": "ねる",
        "romaji": "neru"
      },
      "masu": {
        "kanji": "寝ます",
        "kana": "ねます",
        "romaji": "nemasu"
      },
      "te": {
        "kanji": "寝て",
        "kana": "ねて",
        "romaji": "nete"
      },
      "ta": {
        "kanji": "寝た",
        "kana": "ねた",
        "romaji": "neta"
      },
      "nai": {
        "kanji": "寝ない",
        "kana": "ねない",
        "romaji": "nenai"
      },
      "potential": {
        "kanji": "寝られる",
        "kana": "ねられる",
        "romaji": "nerareru"
      },
      "volitional": {
        "kanji": "寝よう",
        "kana": "ねよう",
        "romaji": "neyou"
      },
      "imperative": {
        "kanji": "寝ろ",
        "kana": "ねろ",
        "romaji": "nero"
      },
      "prohibitive": {
        "kanji": "寝るな",
        "kana": "ねるな",
        "romaji": "neruna"
      },
      "passive": {
        "kanji": "寝られる",
        "kana": "ねられる",
        "romaji": "nerareru"
      },
      "causative": {
        "kanji": "寝させる",
        "kana": "ねさせる",
        "romaji": "nesaseru"
      },
      "causativePassive": {
        "kanji": "寝させられる",
        "kana": "ねさせられる",
        "romaji": "nesaserareru"
      },
      "ba": {
        "kanji": "寝れば",
        "kana": "ねれば",
        "romaji": "nereba"
      }
    }
  },
  {
    "id": "miru",
    "kanji": "見る",
    "kana": "みる",
    "romaji": "miru",
    "english": "to see / watch",
    "indonesian": "melihat / menonton",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "見る",
        "kana": "みる",
        "romaji": "miru"
      },
      "masu": {
        "kanji": "見ます",
        "kana": "みます",
        "romaji": "mimasu"
      },
      "te": {
        "kanji": "見て",
        "kana": "みて",
        "romaji": "mite"
      },
      "ta": {
        "kanji": "見た",
        "kana": "みた",
        "romaji": "mita"
      },
      "nai": {
        "kanji": "見ない",
        "kana": "みない",
        "romaji": "minai"
      },
      "potential": {
        "kanji": "見られる",
        "kana": "みられる",
        "romaji": "mirareru"
      },
      "volitional": {
        "kanji": "見よう",
        "kana": "みよう",
        "romaji": "miyou"
      },
      "imperative": {
        "kanji": "見ろ",
        "kana": "みろ",
        "romaji": "miro"
      },
      "prohibitive": {
        "kanji": "見るな",
        "kana": "みるな",
        "romaji": "miruna"
      },
      "passive": {
        "kanji": "見られる",
        "kana": "みられる",
        "romaji": "mirareru"
      },
      "causative": {
        "kanji": "見させる",
        "kana": "みさせる",
        "romaji": "misaseru"
      },
      "causativePassive": {
        "kanji": "見させられる",
        "kana": "みさせられる",
        "romaji": "misaserareru"
      },
      "ba": {
        "kanji": "見れば",
        "kana": "みれば",
        "romaji": "mireba"
      }
    }
  },
  {
    "id": "oshieru",
    "kanji": "教える",
    "kana": "おしえる",
    "romaji": "oshieru",
    "english": "to teach / inform",
    "indonesian": "mengajar / memberitahu",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "教える",
        "kana": "おしえる",
        "romaji": "oshieru"
      },
      "masu": {
        "kanji": "教えます",
        "kana": "おしえます",
        "romaji": "oshiemasu"
      },
      "te": {
        "kanji": "教えて",
        "kana": "おしえて",
        "romaji": "oshiete"
      },
      "ta": {
        "kanji": "教えた",
        "kana": "おしえた",
        "romaji": "oshieta"
      },
      "nai": {
        "kanji": "教えない",
        "kana": "おしえない",
        "romaji": "oshienai"
      },
      "potential": {
        "kanji": "教えられる",
        "kana": "おしえられる",
        "romaji": "oshierareru"
      },
      "volitional": {
        "kanji": "教えよう",
        "kana": "おしえよう",
        "romaji": "oshieyou"
      },
      "imperative": {
        "kanji": "教えろ",
        "kana": "おしえろ",
        "romaji": "oshiero"
      },
      "prohibitive": {
        "kanji": "教えるな",
        "kana": "おしえるな",
        "romaji": "oshieruna"
      },
      "passive": {
        "kanji": "教えられる",
        "kana": "おしえられる",
        "romaji": "oshierareru"
      },
      "causative": {
        "kanji": "教えさせる",
        "kana": "おしえさせる",
        "romaji": "oshiesaseru"
      },
      "causativePassive": {
        "kanji": "教えさせられる",
        "kana": "おしえさせられる",
        "romaji": "oshiesaserareru"
      },
      "ba": {
        "kanji": "教えれば",
        "kana": "おしえれば",
        "romaji": "oshiereba"
      }
    }
  },
  {
    "id": "kariru",
    "kanji": "借りる",
    "kana": "かりる",
    "romaji": "kariru",
    "english": "to borrow",
    "indonesian": "meminjam",
    "jlpt": "N4",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "借りる",
        "kana": "かりる",
        "romaji": "kariru"
      },
      "masu": {
        "kanji": "借ります",
        "kana": "かります",
        "romaji": "karimasu"
      },
      "te": {
        "kanji": "借りて",
        "kana": "かりて",
        "romaji": "karite"
      },
      "ta": {
        "kanji": "借りた",
        "kana": "かりた",
        "romaji": "karita"
      },
      "nai": {
        "kanji": "借りない",
        "kana": "かりない",
        "romaji": "karinai"
      },
      "potential": {
        "kanji": "借りられる",
        "kana": "かりられる",
        "romaji": "karirareru"
      },
      "volitional": {
        "kanji": "借りよう",
        "kana": "かりよう",
        "romaji": "kariyou"
      },
      "imperative": {
        "kanji": "借りろ",
        "kana": "かりろ",
        "romaji": "kariro"
      },
      "prohibitive": {
        "kanji": "借りるな",
        "kana": "かりるな",
        "romaji": "kariruna"
      },
      "passive": {
        "kanji": "借りられる",
        "kana": "かりられる",
        "romaji": "karirareru"
      },
      "causative": {
        "kanji": "借りさせる",
        "kana": "かりさせる",
        "romaji": "karisaseru"
      },
      "causativePassive": {
        "kanji": "借りさせられる",
        "kana": "かりさせられる",
        "romaji": "karisaserareru"
      },
      "ba": {
        "kanji": "借りれば",
        "kana": "かりれば",
        "romaji": "karireba"
      }
    }
  },
  {
    "id": "akeru",
    "kanji": "開ける",
    "kana": "あける",
    "romaji": "akeru",
    "english": "to open",
    "indonesian": "membuka",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "開ける",
        "kana": "あける",
        "romaji": "akeru"
      },
      "masu": {
        "kanji": "開けます",
        "kana": "あけます",
        "romaji": "akemasu"
      },
      "te": {
        "kanji": "開けて",
        "kana": "あけて",
        "romaji": "akete"
      },
      "ta": {
        "kanji": "開けた",
        "kana": "あけた",
        "romaji": "aketa"
      },
      "nai": {
        "kanji": "開けない",
        "kana": "あけない",
        "romaji": "akenai"
      },
      "potential": {
        "kanji": "開けられる",
        "kana": "あけられる",
        "romaji": "akerareru"
      },
      "volitional": {
        "kanji": "開けよう",
        "kana": "あけよう",
        "romaji": "akeyou"
      },
      "imperative": {
        "kanji": "開けろ",
        "kana": "あけろ",
        "romaji": "akero"
      },
      "prohibitive": {
        "kanji": "開けるな",
        "kana": "あけるな",
        "romaji": "akeruna"
      },
      "passive": {
        "kanji": "開けられる",
        "kana": "あけられる",
        "romaji": "akerareru"
      },
      "causative": {
        "kanji": "開けさせる",
        "kana": "あけさせる",
        "romaji": "akesaseru"
      },
      "causativePassive": {
        "kanji": "開けさせられる",
        "kana": "あけさせられる",
        "romaji": "akesaserareru"
      },
      "ba": {
        "kanji": "開ければ",
        "kana": "あければ",
        "romaji": "akereba"
      }
    }
  },
  {
    "id": "shimeru",
    "kanji": "閉める",
    "kana": "しめる",
    "romaji": "shimeru",
    "english": "to close",
    "indonesian": "menutup",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "閉める",
        "kana": "しめる",
        "romaji": "shimeru"
      },
      "masu": {
        "kanji": "閉めます",
        "kana": "しめます",
        "romaji": "shimemasu"
      },
      "te": {
        "kanji": "閉めて",
        "kana": "しめて",
        "romaji": "shimete"
      },
      "ta": {
        "kanji": "閉めた",
        "kana": "しめた",
        "romaji": "shimeta"
      },
      "nai": {
        "kanji": "閉めない",
        "kana": "しめない",
        "romaji": "shimenai"
      },
      "potential": {
        "kanji": "閉められる",
        "kana": "しめられる",
        "romaji": "shimerareru"
      },
      "volitional": {
        "kanji": "閉めよう",
        "kana": "しめよう",
        "romaji": "shimeyou"
      },
      "imperative": {
        "kanji": "閉めろ",
        "kana": "しめろ",
        "romaji": "shimero"
      },
      "prohibitive": {
        "kanji": "閉めるな",
        "kana": "しめるな",
        "romaji": "shimeruna"
      },
      "passive": {
        "kanji": "閉められる",
        "kana": "しめられる",
        "romaji": "shimerareru"
      },
      "causative": {
        "kanji": "閉めさせる",
        "kana": "しめさせる",
        "romaji": "shimesaseru"
      },
      "causativePassive": {
        "kanji": "閉めさせられる",
        "kana": "しめさせられる",
        "romaji": "shimesaserareru"
      },
      "ba": {
        "kanji": "閉めれば",
        "kana": "しめれば",
        "romaji": "shimereba"
      }
    }
  },
  {
    "id": "yameru",
    "kanji": "やめる",
    "kana": "やめる",
    "romaji": "yameru",
    "english": "to stop / quit",
    "indonesian": "berhenti / menghentikan",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "やめる",
        "kana": "やめる",
        "romaji": "yameru"
      },
      "masu": {
        "kanji": "やめます",
        "kana": "やめます",
        "romaji": "yamemasu"
      },
      "te": {
        "kanji": "やめて",
        "kana": "やめて",
        "romaji": "yamete"
      },
      "ta": {
        "kanji": "やめた",
        "kana": "やめた",
        "romaji": "yameta"
      },
      "nai": {
        "kanji": "やめない",
        "kana": "やめない",
        "romaji": "yamenai"
      },
      "potential": {
        "kanji": "やめられる",
        "kana": "やめられる",
        "romaji": "yamerareru"
      },
      "volitional": {
        "kanji": "やめよう",
        "kana": "やめよう",
        "romaji": "yameyou"
      },
      "imperative": {
        "kanji": "やめろ",
        "kana": "やめろ",
        "romaji": "yamero"
      },
      "prohibitive": {
        "kanji": "やめるな",
        "kana": "やめるな",
        "romaji": "yameruna"
      },
      "passive": {
        "kanji": "やめられる",
        "kana": "やめられる",
        "romaji": "yamerareru"
      },
      "causative": {
        "kanji": "やめさせる",
        "kana": "やめさせる",
        "romaji": "yamesaseru"
      },
      "causativePassive": {
        "kanji": "やめさせられる",
        "kana": "やめさせられる",
        "romaji": "yamesaserareru"
      },
      "ba": {
        "kanji": "やめれば",
        "kana": "やめれば",
        "romaji": "yamereba"
      }
    }
  },
  {
    "id": "oboeru",
    "kanji": "覚える",
    "kana": "おぼえる",
    "romaji": "oboeru",
    "english": "to remember",
    "indonesian": "mengingat",
    "jlpt": "N4",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "覚える",
        "kana": "おぼえる",
        "romaji": "oboeru"
      },
      "masu": {
        "kanji": "覚えます",
        "kana": "おぼえます",
        "romaji": "oboemasu"
      },
      "te": {
        "kanji": "覚えて",
        "kana": "おぼえて",
        "romaji": "oboete"
      },
      "ta": {
        "kanji": "覚えた",
        "kana": "おぼえた",
        "romaji": "oboeta"
      },
      "nai": {
        "kanji": "覚えない",
        "kana": "おぼえない",
        "romaji": "oboenai"
      },
      "potential": {
        "kanji": "覚えられる",
        "kana": "おぼえられる",
        "romaji": "oboerareru"
      },
      "volitional": {
        "kanji": "覚えよう",
        "kana": "おぼえよう",
        "romaji": "oboeyou"
      },
      "imperative": {
        "kanji": "覚えろ",
        "kana": "おぼえろ",
        "romaji": "oboero"
      },
      "prohibitive": {
        "kanji": "覚えるな",
        "kana": "おぼえるな",
        "romaji": "oboeruna"
      },
      "passive": {
        "kanji": "覚えられる",
        "kana": "おぼえられる",
        "romaji": "oboerareru"
      },
      "causative": {
        "kanji": "覚えさせる",
        "kana": "おぼえさせる",
        "romaji": "oboesaseru"
      },
      "causativePassive": {
        "kanji": "覚えさせられる",
        "kana": "おぼえさせられる",
        "romaji": "oboesaserareru"
      },
      "ba": {
        "kanji": "覚えれば",
        "kana": "おぼえれば",
        "romaji": "oboereba"
      }
    }
  },
  {
    "id": "shiraberu",
    "kanji": "調べる",
    "kana": "しらべる",
    "romaji": "shiraberu",
    "english": "to investigate / check",
    "indonesian": "memeriksa / menyelidiki",
    "jlpt": "N3",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "調べる",
        "kana": "しらべる",
        "romaji": "shiraberu"
      },
      "masu": {
        "kanji": "調べます",
        "kana": "しらべます",
        "romaji": "shirabemasu"
      },
      "te": {
        "kanji": "調べて",
        "kana": "しらべて",
        "romaji": "shirabete"
      },
      "ta": {
        "kanji": "調べた",
        "kana": "しらべた",
        "romaji": "shirabeta"
      },
      "nai": {
        "kanji": "調べない",
        "kana": "しらべない",
        "romaji": "shirabenai"
      },
      "potential": {
        "kanji": "調べられる",
        "kana": "しらべられる",
        "romaji": "shiraberareru"
      },
      "volitional": {
        "kanji": "調べよう",
        "kana": "しらべよう",
        "romaji": "shirabeyou"
      },
      "imperative": {
        "kanji": "調べろ",
        "kana": "しらべろ",
        "romaji": "shirabero"
      },
      "prohibitive": {
        "kanji": "調べるな",
        "kana": "しらべるな",
        "romaji": "shiraberuna"
      },
      "passive": {
        "kanji": "調べられる",
        "kana": "しらべられる",
        "romaji": "shiraberareru"
      },
      "causative": {
        "kanji": "調べさせる",
        "kana": "しらべさせる",
        "romaji": "shirabesaseru"
      },
      "causativePassive": {
        "kanji": "調べさせられる",
        "kana": "しらべさせられる",
        "romaji": "shirabesaserareru"
      },
      "ba": {
        "kanji": "調べれば",
        "kana": "しらべれば",
        "romaji": "shirabereba"
      }
    }
  },
  {
    "id": "deru",
    "kanji": "出る",
    "kana": "でる",
    "romaji": "deru",
    "english": "to leave / go out",
    "indonesian": "keluar",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "出る",
        "kana": "でる",
        "romaji": "deru"
      },
      "masu": {
        "kanji": "出ます",
        "kana": "でます",
        "romaji": "demasu"
      },
      "te": {
        "kanji": "出て",
        "kana": "でて",
        "romaji": "dete"
      },
      "ta": {
        "kanji": "出た",
        "kana": "でた",
        "romaji": "deta"
      },
      "nai": {
        "kanji": "出ない",
        "kana": "でない",
        "romaji": "denai"
      },
      "potential": {
        "kanji": "出られる",
        "kana": "でられる",
        "romaji": "derareru"
      },
      "volitional": {
        "kanji": "出よう",
        "kana": "でよう",
        "romaji": "deyou"
      },
      "imperative": {
        "kanji": "出ろ",
        "kana": "でろ",
        "romaji": "dero"
      },
      "prohibitive": {
        "kanji": "出るな",
        "kana": "でるな",
        "romaji": "deruna"
      },
      "passive": {
        "kanji": "出られる",
        "kana": "でられる",
        "romaji": "derareru"
      },
      "causative": {
        "kanji": "出させる",
        "kana": "でさせる",
        "romaji": "desaseru"
      },
      "causativePassive": {
        "kanji": "出させられる",
        "kana": "でさせられる",
        "romaji": "desaserareru"
      },
      "ba": {
        "kanji": "出れば",
        "kana": "でれば",
        "romaji": "dereba"
      }
    }
  },
  {
    "id": "miseru",
    "kanji": "見せる",
    "kana": "みせる",
    "romaji": "miseru",
    "english": "to show",
    "indonesian": "menunjukkan",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "見せる",
        "kana": "みせる",
        "romaji": "miseru"
      },
      "masu": {
        "kanji": "見せます",
        "kana": "みせます",
        "romaji": "misemasu"
      },
      "te": {
        "kanji": "見せて",
        "kana": "みせて",
        "romaji": "misete"
      },
      "ta": {
        "kanji": "見せた",
        "kana": "みせた",
        "romaji": "miseta"
      },
      "nai": {
        "kanji": "見せない",
        "kana": "みせない",
        "romaji": "misenai"
      },
      "potential": {
        "kanji": "見せられる",
        "kana": "みせられる",
        "romaji": "miserareru"
      },
      "volitional": {
        "kanji": "見せよう",
        "kana": "みせよう",
        "romaji": "miseyou"
      },
      "imperative": {
        "kanji": "見せろ",
        "kana": "みせろ",
        "romaji": "misero"
      },
      "prohibitive": {
        "kanji": "見せるな",
        "kana": "みせるな",
        "romaji": "miseruna"
      },
      "passive": {
        "kanji": "見せられる",
        "kana": "みせられる",
        "romaji": "miserareru"
      },
      "causative": {
        "kanji": "見せさせる",
        "kana": "みせさせる",
        "romaji": "misesaseru"
      },
      "causativePassive": {
        "kanji": "見せさせられる",
        "kana": "みせさせられる",
        "romaji": "misesaserareru"
      },
      "ba": {
        "kanji": "見せれば",
        "kana": "みせれば",
        "romaji": "misereba"
      }
    }
  },
  {
    "id": "tsukeru",
    "kanji": "つける",
    "kana": "つける",
    "romaji": "tsukeru",
    "english": "to turn on",
    "indonesian": "menyalakan",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "つける",
        "kana": "つける",
        "romaji": "tsukeru"
      },
      "masu": {
        "kanji": "つけます",
        "kana": "つけます",
        "romaji": "tsukemasu"
      },
      "te": {
        "kanji": "つけて",
        "kana": "つけて",
        "romaji": "tsukete"
      },
      "ta": {
        "kanji": "つけた",
        "kana": "つけた",
        "romaji": "tsuketa"
      },
      "nai": {
        "kanji": "つけない",
        "kana": "つけない",
        "romaji": "tsukenai"
      },
      "potential": {
        "kanji": "つけられる",
        "kana": "つけられる",
        "romaji": "tsukerareru"
      },
      "volitional": {
        "kanji": "つけよう",
        "kana": "つけよう",
        "romaji": "tsukeyou"
      },
      "imperative": {
        "kanji": "つけろ",
        "kana": "つけろ",
        "romaji": "tsukero"
      },
      "prohibitive": {
        "kanji": "つけるな",
        "kana": "つけるな",
        "romaji": "tsukeruna"
      },
      "passive": {
        "kanji": "つけられる",
        "kana": "つけられる",
        "romaji": "tsukerareru"
      },
      "causative": {
        "kanji": "つけさせる",
        "kana": "つけさせる",
        "romaji": "tsukesaseru"
      },
      "causativePassive": {
        "kanji": "つけさせられる",
        "kana": "つけさせられる",
        "romaji": "tsukesaserareru"
      },
      "ba": {
        "kanji": "つければ",
        "kana": "つければ",
        "romaji": "tsukereba"
      }
    }
  },
  {
    "id": "kakeru",
    "kanji": "かける",
    "kana": "かける",
    "romaji": "kakeru",
    "english": "to hang / call",
    "indonesian": "menggantung / menelepon",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "かける",
        "kana": "かける",
        "romaji": "kakeru"
      },
      "masu": {
        "kanji": "かけます",
        "kana": "かけます",
        "romaji": "kakemasu"
      },
      "te": {
        "kanji": "かけて",
        "kana": "かけて",
        "romaji": "kakete"
      },
      "ta": {
        "kanji": "かけた",
        "kana": "かけた",
        "romaji": "kaketa"
      },
      "nai": {
        "kanji": "かけない",
        "kana": "かけない",
        "romaji": "kakenai"
      },
      "potential": {
        "kanji": "かけられる",
        "kana": "かけられる",
        "romaji": "kakerareru"
      },
      "volitional": {
        "kanji": "かけよう",
        "kana": "かけよう",
        "romaji": "kakeyou"
      },
      "imperative": {
        "kanji": "かけろ",
        "kana": "かけろ",
        "romaji": "kakero"
      },
      "prohibitive": {
        "kanji": "かけるな",
        "kana": "かけるな",
        "romaji": "kakeruna"
      },
      "passive": {
        "kanji": "かけられる",
        "kana": "かけられる",
        "romaji": "kakerareru"
      },
      "causative": {
        "kanji": "かけさせる",
        "kana": "かけさせる",
        "romaji": "kakesaseru"
      },
      "causativePassive": {
        "kanji": "かけさせられる",
        "kana": "かけさせられる",
        "romaji": "kakesaserareru"
      },
      "ba": {
        "kanji": "かければ",
        "kana": "かければ",
        "romaji": "kakereba"
      }
    }
  },
  {
    "id": "tsuzukeru",
    "kanji": "続ける",
    "kana": "つづける",
    "romaji": "tsuzukeru",
    "english": "to continue",
    "indonesian": "melanjutkan",
    "jlpt": "N4",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "続ける",
        "kana": "つづける",
        "romaji": "tsuzukeru"
      },
      "masu": {
        "kanji": "続けます",
        "kana": "つづけます",
        "romaji": "tsuzukemasu"
      },
      "te": {
        "kanji": "続けて",
        "kana": "つづけて",
        "romaji": "tsuzukete"
      },
      "ta": {
        "kanji": "続けた",
        "kana": "つづけた",
        "romaji": "tsuzuketa"
      },
      "nai": {
        "kanji": "続けない",
        "kana": "つづけない",
        "romaji": "tsuzukenai"
      },
      "potential": {
        "kanji": "続けられる",
        "kana": "つづけられる",
        "romaji": "tsuzukerareru"
      },
      "volitional": {
        "kanji": "続けよう",
        "kana": "つづけよう",
        "romaji": "tsuzukeyou"
      },
      "imperative": {
        "kanji": "続けろ",
        "kana": "つづけろ",
        "romaji": "tsuzukero"
      },
      "prohibitive": {
        "kanji": "続けるな",
        "kana": "つづけるな",
        "romaji": "tsuzukeruna"
      },
      "passive": {
        "kanji": "続けられる",
        "kana": "つづけられる",
        "romaji": "tsuzukerareru"
      },
      "causative": {
        "kanji": "続けさせる",
        "kana": "つづけさせる",
        "romaji": "tsuzukesaseru"
      },
      "causativePassive": {
        "kanji": "続けさせられる",
        "kana": "つづけさせられる",
        "romaji": "tsuzukesaserareru"
      },
      "ba": {
        "kanji": "続ければ",
        "kana": "つづければ",
        "romaji": "tsuzukereba"
      }
    }
  },
  {
    "id": "shinjiru",
    "kanji": "信じる",
    "kana": "しんじる",
    "romaji": "shinjiru",
    "english": "to believe",
    "indonesian": "percaya",
    "jlpt": "N3",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "信じる",
        "kana": "しんじる",
        "romaji": "shinjiru"
      },
      "masu": {
        "kanji": "信じます",
        "kana": "しんじます",
        "romaji": "shinjimasu"
      },
      "te": {
        "kanji": "信じて",
        "kana": "しんじて",
        "romaji": "shinjite"
      },
      "ta": {
        "kanji": "信じた",
        "kana": "しんじた",
        "romaji": "shinjita"
      },
      "nai": {
        "kanji": "信じない",
        "kana": "しんじない",
        "romaji": "shinjinai"
      },
      "potential": {
        "kanji": "信じられる",
        "kana": "しんじられる",
        "romaji": "shinjirareru"
      },
      "volitional": {
        "kanji": "信じよう",
        "kana": "しんじよう",
        "romaji": "shinjiyou"
      },
      "imperative": {
        "kanji": "信じろ",
        "kana": "しんじろ",
        "romaji": "shinjiro"
      },
      "prohibitive": {
        "kanji": "信じるな",
        "kana": "しんじるな",
        "romaji": "shinjiruna"
      },
      "passive": {
        "kanji": "信じられる",
        "kana": "しんじられる",
        "romaji": "shinjirareru"
      },
      "causative": {
        "kanji": "信じさせる",
        "kana": "しんじさせる",
        "romaji": "shinjisaseru"
      },
      "causativePassive": {
        "kanji": "信じさせられる",
        "kana": "しんじさせられる",
        "romaji": "shinjisaserareru"
      },
      "ba": {
        "kanji": "信じれば",
        "kana": "しんじれば",
        "romaji": "shinjireba"
      }
    }
  },
  {
    "id": "ageru",
    "kanji": "上げる",
    "kana": "あげる",
    "romaji": "ageru",
    "english": "to give",
    "indonesian": "memberi",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "上げる",
        "kana": "あげる",
        "romaji": "ageru"
      },
      "masu": {
        "kanji": "上げます",
        "kana": "あげます",
        "romaji": "agemasu"
      },
      "te": {
        "kanji": "上げて",
        "kana": "あげて",
        "romaji": "agete"
      },
      "ta": {
        "kanji": "上げた",
        "kana": "あげた",
        "romaji": "ageta"
      },
      "nai": {
        "kanji": "上げない",
        "kana": "あげない",
        "romaji": "agenai"
      },
      "potential": {
        "kanji": "上げられる",
        "kana": "あげられる",
        "romaji": "agerareru"
      },
      "volitional": {
        "kanji": "上げよう",
        "kana": "あげよう",
        "romaji": "ageyou"
      },
      "imperative": {
        "kanji": "上げろ",
        "kana": "あげろ",
        "romaji": "agero"
      },
      "prohibitive": {
        "kanji": "上げるな",
        "kana": "あげるな",
        "romaji": "ageruna"
      },
      "passive": {
        "kanji": "上げられる",
        "kana": "あげられる",
        "romaji": "agerareru"
      },
      "causative": {
        "kanji": "上げさせる",
        "kana": "あげさせる",
        "romaji": "agesaseru"
      },
      "causativePassive": {
        "kanji": "上げさせられる",
        "kana": "あげさせられる",
        "romaji": "agesaserareru"
      },
      "ba": {
        "kanji": "上げれば",
        "kana": "あげれば",
        "romaji": "agereba"
      }
    }
  },
  {
    "id": "kureru",
    "kanji": "くれる",
    "kana": "くれる",
    "romaji": "kureru",
    "english": "to give (to me)",
    "indonesian": "memberi (kepada saya)",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "くれる",
        "kana": "くれる",
        "romaji": "kureru"
      },
      "masu": {
        "kanji": "くれます",
        "kana": "くれます",
        "romaji": "kuremasu"
      },
      "te": {
        "kanji": "くれて",
        "kana": "くれて",
        "romaji": "kurete"
      },
      "ta": {
        "kanji": "くれた",
        "kana": "くれた",
        "romaji": "kureta"
      },
      "nai": {
        "kanji": "くれない",
        "kana": "くれない",
        "romaji": "kurenai"
      },
      "potential": {
        "kanji": "くれられる",
        "kana": "くれられる",
        "romaji": "kurerareru"
      },
      "volitional": {
        "kanji": "くれよう",
        "kana": "くれよう",
        "romaji": "kureyou"
      },
      "imperative": {
        "kanji": "くれろ",
        "kana": "くれろ",
        "romaji": "kurero"
      },
      "prohibitive": {
        "kanji": "くれるな",
        "kana": "くれるな",
        "romaji": "kureruna"
      },
      "passive": {
        "kanji": "くれられる",
        "kana": "くれられる",
        "romaji": "kurerareru"
      },
      "causative": {
        "kanji": "くれさせる",
        "kana": "くれさせる",
        "romaji": "kuresaseru"
      },
      "causativePassive": {
        "kanji": "くれさせられる",
        "kana": "くれさせられる",
        "romaji": "kuresaserareru"
      },
      "ba": {
        "kanji": "くれれば",
        "kana": "くれれば",
        "romaji": "kurereba"
      }
    }
  },
  {
    "id": "tariru",
    "kanji": "足りる",
    "kana": "たりる",
    "romaji": "tariru",
    "english": "to be sufficient",
    "indonesian": "cukup",
    "jlpt": "N4",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "足りる",
        "kana": "たりる",
        "romaji": "tariru"
      },
      "masu": {
        "kanji": "足ります",
        "kana": "たります",
        "romaji": "tarimasu"
      },
      "te": {
        "kanji": "足りて",
        "kana": "たりて",
        "romaji": "tarite"
      },
      "ta": {
        "kanji": "足りた",
        "kana": "たりた",
        "romaji": "tarita"
      },
      "nai": {
        "kanji": "足りない",
        "kana": "たりない",
        "romaji": "tarinai"
      },
      "potential": {
        "kanji": "足りられる",
        "kana": "たりられる",
        "romaji": "tarirareru"
      },
      "volitional": {
        "kanji": "足りよう",
        "kana": "たりよう",
        "romaji": "tariyou"
      },
      "imperative": {
        "kanji": "足りろ",
        "kana": "たりろ",
        "romaji": "tariro"
      },
      "prohibitive": {
        "kanji": "足りるな",
        "kana": "たりるな",
        "romaji": "tariruna"
      },
      "passive": {
        "kanji": "足りられる",
        "kana": "たりられる",
        "romaji": "tarirareru"
      },
      "causative": {
        "kanji": "足りさせる",
        "kana": "たりさせる",
        "romaji": "tarisaseru"
      },
      "causativePassive": {
        "kanji": "足りさせられる",
        "kana": "たりさせられる",
        "romaji": "tarisaserareru"
      },
      "ba": {
        "kanji": "足りれば",
        "kana": "たりれば",
        "romaji": "tarireba"
      }
    }
  },
  {
    "id": "dekiru",
    "kanji": "できる",
    "kana": "できる",
    "romaji": "dekiru",
    "english": "to be able to",
    "indonesian": "bisa / dapat",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "できる",
        "kana": "できる",
        "romaji": "dekiru"
      },
      "masu": {
        "kanji": "できます",
        "kana": "できます",
        "romaji": "dekimasu"
      },
      "te": {
        "kanji": "できて",
        "kana": "できて",
        "romaji": "dekite"
      },
      "ta": {
        "kanji": "できた",
        "kana": "できた",
        "romaji": "dekita"
      },
      "nai": {
        "kanji": "できない",
        "kana": "できない",
        "romaji": "dekinai"
      },
      "potential": {
        "kanji": "できられる",
        "kana": "できられる",
        "romaji": "dekirareru"
      },
      "volitional": {
        "kanji": "できよう",
        "kana": "できよう",
        "romaji": "dekiyou"
      },
      "imperative": {
        "kanji": "できろ",
        "kana": "できろ",
        "romaji": "dekiro"
      },
      "prohibitive": {
        "kanji": "できるな",
        "kana": "できるな",
        "romaji": "dekiruna"
      },
      "passive": {
        "kanji": "できられる",
        "kana": "できられる",
        "romaji": "dekirareru"
      },
      "causative": {
        "kanji": "できさせる",
        "kana": "できさせる",
        "romaji": "dekisaseru"
      },
      "causativePassive": {
        "kanji": "できさせられる",
        "kana": "できさせられる",
        "romaji": "dekisaserareru"
      },
      "ba": {
        "kanji": "できれば",
        "kana": "できれば",
        "romaji": "dekireba"
      }
    }
  },
  {
    "id": "kangaeru",
    "kanji": "考える",
    "kana": "かんがえる",
    "romaji": "kangaeru",
    "english": "to think / consider",
    "indonesian": "berpikir",
    "jlpt": "N4",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "考える",
        "kana": "かんがえる",
        "romaji": "kangaeru"
      },
      "masu": {
        "kanji": "考えます",
        "kana": "かんがえます",
        "romaji": "kangaemasu"
      },
      "te": {
        "kanji": "考えて",
        "kana": "かんがえて",
        "romaji": "kangaete"
      },
      "ta": {
        "kanji": "考えた",
        "kana": "かんがえた",
        "romaji": "kangaeta"
      },
      "nai": {
        "kanji": "考えない",
        "kana": "かんがえない",
        "romaji": "kangaenai"
      },
      "potential": {
        "kanji": "考えられる",
        "kana": "かんがえられる",
        "romaji": "kangaerareru"
      },
      "volitional": {
        "kanji": "考えよう",
        "kana": "かんがえよう",
        "romaji": "kangaeyou"
      },
      "imperative": {
        "kanji": "考えろ",
        "kana": "かんがえろ",
        "romaji": "kangaero"
      },
      "prohibitive": {
        "kanji": "考えるな",
        "kana": "かんがえるな",
        "romaji": "kangaeruna"
      },
      "passive": {
        "kanji": "考えられる",
        "kana": "かんがえられる",
        "romaji": "kangaerareru"
      },
      "causative": {
        "kanji": "考えさせる",
        "kana": "かんがえさせる",
        "romaji": "kangaesaseru"
      },
      "causativePassive": {
        "kanji": "考えさせられる",
        "kana": "かんがえさせられる",
        "romaji": "kangaesaserareru"
      },
      "ba": {
        "kanji": "考えれば",
        "kana": "かんがえれば",
        "romaji": "kangaereba"
      }
    }
  },
  {
    "id": "wasureru",
    "kanji": "忘れる",
    "kana": "わすれる",
    "romaji": "wasureru",
    "english": "to forget",
    "indonesian": "lupa / melupakan",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "忘れる",
        "kana": "わすれる",
        "romaji": "wasureru"
      },
      "masu": {
        "kanji": "忘れます",
        "kana": "わすれます",
        "romaji": "wasuremasu"
      },
      "te": {
        "kanji": "忘れて",
        "kana": "わすれて",
        "romaji": "wasurete"
      },
      "ta": {
        "kanji": "忘れた",
        "kana": "わすれた",
        "romaji": "wasureta"
      },
      "nai": {
        "kanji": "忘れない",
        "kana": "わすれない",
        "romaji": "wasurenai"
      },
      "potential": {
        "kanji": "忘れられる",
        "kana": "わすれられる",
        "romaji": "wasurerareru"
      },
      "volitional": {
        "kanji": "忘れよう",
        "kana": "わすれよう",
        "romaji": "wasureyou"
      },
      "imperative": {
        "kanji": "忘れろ",
        "kana": "わすれろ",
        "romaji": "wasurero"
      },
      "prohibitive": {
        "kanji": "忘れるな",
        "kana": "わすれるな",
        "romaji": "wasureruna"
      },
      "passive": {
        "kanji": "忘れられる",
        "kana": "わすれられる",
        "romaji": "wasurerareru"
      },
      "causative": {
        "kanji": "忘れさせる",
        "kana": "わすれさせる",
        "romaji": "wasuresaseru"
      },
      "causativePassive": {
        "kanji": "忘れさせられる",
        "kana": "わすれさせられる",
        "romaji": "wasuresaserareru"
      },
      "ba": {
        "kanji": "忘れれば",
        "kana": "わすれれば",
        "romaji": "wasurereba"
      }
    }
  },
  {
    "id": "nigeru",
    "kanji": "逃げる",
    "kana": "にげる",
    "romaji": "nigeru",
    "english": "to run away",
    "indonesian": "melarikan diri",
    "jlpt": "N3",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "逃げる",
        "kana": "にげる",
        "romaji": "nigeru"
      },
      "masu": {
        "kanji": "逃げます",
        "kana": "にげます",
        "romaji": "nigemasu"
      },
      "te": {
        "kanji": "逃げて",
        "kana": "にげて",
        "romaji": "nigete"
      },
      "ta": {
        "kanji": "逃げた",
        "kana": "にげた",
        "romaji": "nigeta"
      },
      "nai": {
        "kanji": "逃げない",
        "kana": "にげない",
        "romaji": "nigenai"
      },
      "potential": {
        "kanji": "逃げられる",
        "kana": "にげられる",
        "romaji": "nigerareru"
      },
      "volitional": {
        "kanji": "逃げよう",
        "kana": "にげよう",
        "romaji": "nigeyou"
      },
      "imperative": {
        "kanji": "逃げろ",
        "kana": "にげろ",
        "romaji": "nigero"
      },
      "prohibitive": {
        "kanji": "逃げるな",
        "kana": "にげるな",
        "romaji": "nigeruna"
      },
      "passive": {
        "kanji": "逃げられる",
        "kana": "にげられる",
        "romaji": "nigerareru"
      },
      "causative": {
        "kanji": "逃げさせる",
        "kana": "にげさせる",
        "romaji": "nigesaseru"
      },
      "causativePassive": {
        "kanji": "逃げさせられる",
        "kana": "にげさせられる",
        "romaji": "nigesaserareru"
      },
      "ba": {
        "kanji": "逃げれば",
        "kana": "にげれば",
        "romaji": "nigereba"
      }
    }
  },
  {
    "id": "makeru",
    "kanji": "負ける",
    "kana": "まける",
    "romaji": "makeru",
    "english": "to lose",
    "indonesian": "kalah",
    "jlpt": "N4",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "負ける",
        "kana": "まける",
        "romaji": "makeru"
      },
      "masu": {
        "kanji": "負けます",
        "kana": "まけます",
        "romaji": "makemasu"
      },
      "te": {
        "kanji": "負けて",
        "kana": "まけて",
        "romaji": "makete"
      },
      "ta": {
        "kanji": "負けた",
        "kana": "まけた",
        "romaji": "maketa"
      },
      "nai": {
        "kanji": "負けない",
        "kana": "まけない",
        "romaji": "makenai"
      },
      "potential": {
        "kanji": "負けられる",
        "kana": "まけられる",
        "romaji": "makerareru"
      },
      "volitional": {
        "kanji": "負けよう",
        "kana": "まけよう",
        "romaji": "makeyou"
      },
      "imperative": {
        "kanji": "負けろ",
        "kana": "まけろ",
        "romaji": "makero"
      },
      "prohibitive": {
        "kanji": "負けるな",
        "kana": "まけるな",
        "romaji": "makeruna"
      },
      "passive": {
        "kanji": "負けられる",
        "kana": "まけられる",
        "romaji": "makerareru"
      },
      "causative": {
        "kanji": "負けさせる",
        "kana": "まけさせる",
        "romaji": "makesaseru"
      },
      "causativePassive": {
        "kanji": "負けさせられる",
        "kana": "まけさせられる",
        "romaji": "makesaserareru"
      },
      "ba": {
        "kanji": "負ければ",
        "kana": "まければ",
        "romaji": "makereba"
      }
    }
  },
  {
    "id": "yuleru",
    "kanji": "揺れる",
    "kana": "ゆれる",
    "romaji": "yureru",
    "english": "to shake / swing",
    "indonesian": "bergoyang",
    "jlpt": "N3",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "揺れる",
        "kana": "ゆれる",
        "romaji": "yureru"
      },
      "masu": {
        "kanji": "揺れます",
        "kana": "ゆれます",
        "romaji": "yuremasu"
      },
      "te": {
        "kanji": "揺れて",
        "kana": "ゆれて",
        "romaji": "yurete"
      },
      "ta": {
        "kanji": "揺れた",
        "kana": "ゆれた",
        "romaji": "yureta"
      },
      "nai": {
        "kanji": "揺れない",
        "kana": "ゆれない",
        "romaji": "yurenai"
      },
      "potential": {
        "kanji": "揺れられる",
        "kana": "ゆれられる",
        "romaji": "yurerareru"
      },
      "volitional": {
        "kanji": "揺れよう",
        "kana": "ゆれよう",
        "romaji": "yureyou"
      },
      "imperative": {
        "kanji": "揺れろ",
        "kana": "ゆれろ",
        "romaji": "yurero"
      },
      "prohibitive": {
        "kanji": "揺れるな",
        "kana": "ゆれるな",
        "romaji": "yureruna"
      },
      "passive": {
        "kanji": "揺れられる",
        "kana": "ゆれられる",
        "romaji": "yurerareru"
      },
      "causative": {
        "kanji": "揺れさせる",
        "kana": "ゆれさせる",
        "romaji": "yuresaseru"
      },
      "causativePassive": {
        "kanji": "揺れさせられる",
        "kana": "ゆれさせられる",
        "romaji": "yuresaserareru"
      },
      "ba": {
        "kanji": "揺れれば",
        "kana": "ゆれれば",
        "romaji": "yurereba"
      }
    }
  },
  {
    "id": "arawareru",
    "kanji": "現れる",
    "kana": "あらわれる",
    "romaji": "arawareru",
    "english": "to appear",
    "indonesian": "muncul",
    "jlpt": "N3",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "現れる",
        "kana": "あらわれる",
        "romaji": "arawareru"
      },
      "masu": {
        "kanji": "現れます",
        "kana": "あらわれます",
        "romaji": "arawaremasu"
      },
      "te": {
        "kanji": "現れて",
        "kana": "あらわれて",
        "romaji": "arawarete"
      },
      "ta": {
        "kanji": "現れた",
        "kana": "あらわれた",
        "romaji": "arawareta"
      },
      "nai": {
        "kanji": "現れない",
        "kana": "あらわれない",
        "romaji": "arawarenai"
      },
      "potential": {
        "kanji": "現れられる",
        "kana": "あらわれられる",
        "romaji": "arawarerareru"
      },
      "volitional": {
        "kanji": "現れよう",
        "kana": "あらわれよう",
        "romaji": "arawareyou"
      },
      "imperative": {
        "kanji": "現れろ",
        "kana": "あらわれろ",
        "romaji": "arawarero"
      },
      "prohibitive": {
        "kanji": "現れるな",
        "kana": "あらわれるな",
        "romaji": "arawareruna"
      },
      "passive": {
        "kanji": "現れられる",
        "kana": "あらわれられる",
        "romaji": "arawarerareru"
      },
      "causative": {
        "kanji": "現れさせる",
        "kana": "あらわれさせる",
        "romaji": "arawaresaseru"
      },
      "causativePassive": {
        "kanji": "現れさせられる",
        "kana": "あらわれさせられる",
        "romaji": "arawaresaserareru"
      },
      "ba": {
        "kanji": "現れれば",
        "kana": "あらわれれば",
        "romaji": "arawarereba"
      }
    }
  },
  {
    "id": "tsutaeru",
    "kanji": "伝える",
    "kana": "つたえる",
    "romaji": "tsutaeru",
    "english": "to convey / report",
    "indonesian": "menyampaikan",
    "jlpt": "N4",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "伝える",
        "kana": "つたえる",
        "romaji": "tsutaeru"
      },
      "masu": {
        "kanji": "伝えます",
        "kana": "つたえます",
        "romaji": "tsutaemasu"
      },
      "te": {
        "kanji": "伝えて",
        "kana": "つたえて",
        "romaji": "tsutaete"
      },
      "ta": {
        "kanji": "伝えた",
        "kana": "つたえた",
        "romaji": "tsutaeta"
      },
      "nai": {
        "kanji": "伝えない",
        "kana": "つたえない",
        "romaji": "tsutaenai"
      },
      "potential": {
        "kanji": "伝えられる",
        "kana": "つたえられる",
        "romaji": "tsutaerareru"
      },
      "volitional": {
        "kanji": "伝えよう",
        "kana": "つたえよう",
        "romaji": "tsutaeyou"
      },
      "imperative": {
        "kanji": "伝えろ",
        "kana": "つたえろ",
        "romaji": "tsutaero"
      },
      "prohibitive": {
        "kanji": "伝えるな",
        "kana": "つたえるな",
        "romaji": "tsutaeruna"
      },
      "passive": {
        "kanji": "伝えられる",
        "kana": "つたえられる",
        "romaji": "tsutaerareru"
      },
      "causative": {
        "kanji": "伝えさせる",
        "kana": "つたえさせる",
        "romaji": "tsutaesaseru"
      },
      "causativePassive": {
        "kanji": "伝えさせられる",
        "kana": "つたえさせられる",
        "romaji": "tsutaesaserareru"
      },
      "ba": {
        "kanji": "伝えれば",
        "kana": "つたえれば",
        "romaji": "tsutaereba"
      }
    }
  },
  {
    "id": "shiraseru",
    "kanji": "知らせる",
    "kana": "しらせる",
    "romaji": "shiraseru",
    "english": "to notify",
    "indonesian": "memberitahu",
    "jlpt": "N3",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "知らせる",
        "kana": "しらせる",
        "romaji": "shiraseru"
      },
      "masu": {
        "kanji": "知らせます",
        "kana": "しらせます",
        "romaji": "shirasemasu"
      },
      "te": {
        "kanji": "知らせて",
        "kana": "しらせて",
        "romaji": "shirasete"
      },
      "ta": {
        "kanji": "知らせた",
        "kana": "しらせた",
        "romaji": "shiraseta"
      },
      "nai": {
        "kanji": "知らせない",
        "kana": "しらせない",
        "romaji": "shirasenai"
      },
      "potential": {
        "kanji": "知らせられる",
        "kana": "しらせられる",
        "romaji": "shiraserareru"
      },
      "volitional": {
        "kanji": "知らせよう",
        "kana": "しらせよう",
        "romaji": "shiraseyou"
      },
      "imperative": {
        "kanji": "知らせろ",
        "kana": "しらせろ",
        "romaji": "shirasero"
      },
      "prohibitive": {
        "kanji": "知らせるな",
        "kana": "しらせるな",
        "romaji": "shiraseruna"
      },
      "passive": {
        "kanji": "知らせられる",
        "kana": "しらせられる",
        "romaji": "shiraserareru"
      },
      "causative": {
        "kanji": "知らせさせる",
        "kana": "しらせさせる",
        "romaji": "shirasesaseru"
      },
      "causativePassive": {
        "kanji": "知らせさせられる",
        "kana": "しらせさせられる",
        "romaji": "shirasesaserareru"
      },
      "ba": {
        "kanji": "知らせれば",
        "kana": "しらせれば",
        "romaji": "shirasereba"
      }
    }
  },
  {
    "id": "wasureru_2",
    "kanji": "忘れる",
    "kana": "わすれる",
    "romaji": "wasureru",
    "english": "to forget",
    "indonesian": "lupa",
    "jlpt": "N5",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "忘れる",
        "kana": "わすれる",
        "romaji": "wasureru"
      },
      "masu": {
        "kanji": "忘れます",
        "kana": "わすれます",
        "romaji": "wasuremasu"
      },
      "te": {
        "kanji": "忘れて",
        "kana": "わすれて",
        "romaji": "wasurete"
      },
      "ta": {
        "kanji": "忘れた",
        "kana": "わすれた",
        "romaji": "wasureta"
      },
      "nai": {
        "kanji": "忘れない",
        "kana": "わすれない",
        "romaji": "wasurenai"
      },
      "potential": {
        "kanji": "忘れられる",
        "kana": "わすれられる",
        "romaji": "wasurerareru"
      },
      "volitional": {
        "kanji": "忘れよう",
        "kana": "わすれよう",
        "romaji": "wasureyou"
      },
      "imperative": {
        "kanji": "忘れろ",
        "kana": "わすれろ",
        "romaji": "wasurero"
      },
      "prohibitive": {
        "kanji": "忘れるな",
        "kana": "わすれるな",
        "romaji": "wasureruna"
      },
      "passive": {
        "kanji": "忘れられる",
        "kana": "わすれられる",
        "romaji": "wasurerareru"
      },
      "causative": {
        "kanji": "忘れさせる",
        "kana": "わすれさせる",
        "romaji": "wasuresaseru"
      },
      "causativePassive": {
        "kanji": "忘れさせられる",
        "kana": "わすれさせられる",
        "romaji": "wasuresaserareru"
      },
      "ba": {
        "kanji": "忘れれば",
        "kana": "わすれれば",
        "romaji": "wasurereba"
      }
    }
  },
  {
    "id": "sodateru",
    "kanji": "育てる",
    "kana": "そだてる",
    "romaji": "sodateru",
    "english": "to raise / bring up",
    "indonesian": "membesarkan / mendidik",
    "jlpt": "N3",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "育てる",
        "kana": "そだてる",
        "romaji": "sodateru"
      },
      "masu": {
        "kanji": "育てます",
        "kana": "そだてます",
        "romaji": "sodatemasu"
      },
      "te": {
        "kanji": "育てて",
        "kana": "そだてて",
        "romaji": "sodatete"
      },
      "ta": {
        "kanji": "育てた",
        "kana": "そだてた",
        "romaji": "sodateta"
      },
      "nai": {
        "kanji": "育てない",
        "kana": "そだてない",
        "romaji": "sodatenai"
      },
      "potential": {
        "kanji": "育てられる",
        "kana": "そだてられる",
        "romaji": "sodaterareru"
      },
      "volitional": {
        "kanji": "育てよう",
        "kana": "そだてよう",
        "romaji": "sodateyou"
      },
      "imperative": {
        "kanji": "育てろ",
        "kana": "そだてろ",
        "romaji": "sodatero"
      },
      "prohibitive": {
        "kanji": "育てるな",
        "kana": "そだてるな",
        "romaji": "sodateruna"
      },
      "passive": {
        "kanji": "育てられる",
        "kana": "そだてられる",
        "romaji": "sodaterareru"
      },
      "causative": {
        "kanji": "育てさせる",
        "kana": "そだてさせる",
        "romaji": "sodatesaseru"
      },
      "causativePassive": {
        "kanji": "育てさせられる",
        "kana": "そだてさせられる",
        "romaji": "sodatesaserareru"
      },
      "ba": {
        "kanji": "育てれば",
        "kana": "そだてれば",
        "romaji": "sodatereba"
      }
    }
  },
  {
    "id": "tasukeru",
    "kanji": "助ける",
    "kana": "たすける",
    "romaji": "tasukeru",
    "english": "to save / help",
    "indonesian": "menolong / menyelamatkan",
    "jlpt": "N3",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "助ける",
        "kana": "たすける",
        "romaji": "tasukeru"
      },
      "masu": {
        "kanji": "助けます",
        "kana": "たすけます",
        "romaji": "tasukemasu"
      },
      "te": {
        "kanji": "助けて",
        "kana": "たすけて",
        "romaji": "tasukete"
      },
      "ta": {
        "kanji": "助けた",
        "kana": "たすけた",
        "romaji": "tasuketa"
      },
      "nai": {
        "kanji": "助けない",
        "kana": "たすけない",
        "romaji": "tasukenai"
      },
      "potential": {
        "kanji": "助けられる",
        "kana": "たすけられる",
        "romaji": "tasukerareru"
      },
      "volitional": {
        "kanji": "助けよう",
        "kana": "たすけよう",
        "romaji": "tasukeyou"
      },
      "imperative": {
        "kanji": "助けろ",
        "kana": "たすけろ",
        "romaji": "tasukero"
      },
      "prohibitive": {
        "kanji": "助けるな",
        "kana": "たすけるな",
        "romaji": "tasukeruna"
      },
      "passive": {
        "kanji": "助けられる",
        "kana": "たすけられる",
        "romaji": "tasukerareru"
      },
      "causative": {
        "kanji": "助けさせる",
        "kana": "たすけさせる",
        "romaji": "tasukesaseru"
      },
      "causativePassive": {
        "kanji": "助けさせられる",
        "kana": "たすけさせられる",
        "romaji": "tasukesaserareru"
      },
      "ba": {
        "kanji": "助ければ",
        "kana": "たすければ",
        "romaji": "tasukereba"
      }
    }
  },
  {
    "id": "kimeru",
    "kanji": "決める",
    "kana": "きめる",
    "romaji": "kimeru",
    "english": "to decide",
    "indonesian": "memutuskan",
    "jlpt": "N4",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "決める",
        "kana": "きめる",
        "romaji": "kimeru"
      },
      "masu": {
        "kanji": "決めます",
        "kana": "きめます",
        "romaji": "kimemasu"
      },
      "te": {
        "kanji": "決めて",
        "kana": "きめて",
        "romaji": "kimete"
      },
      "ta": {
        "kanji": "決めた",
        "kana": "きめた",
        "romaji": "kimeta"
      },
      "nai": {
        "kanji": "決めない",
        "kana": "きめない",
        "romaji": "kimenai"
      },
      "potential": {
        "kanji": "決められる",
        "kana": "きめられる",
        "romaji": "kimerareru"
      },
      "volitional": {
        "kanji": "決めよう",
        "kana": "きめよう",
        "romaji": "kimeyou"
      },
      "imperative": {
        "kanji": "決めろ",
        "kana": "きめろ",
        "romaji": "kimero"
      },
      "prohibitive": {
        "kanji": "決めるな",
        "kana": "きめるな",
        "romaji": "kimeruna"
      },
      "passive": {
        "kanji": "決められる",
        "kana": "きめられる",
        "romaji": "kimerareru"
      },
      "causative": {
        "kanji": "決めさせる",
        "kana": "きめさせる",
        "romaji": "kimesaseru"
      },
      "causativePassive": {
        "kanji": "決めさせられる",
        "kana": "きめさせられる",
        "romaji": "kimesaserareru"
      },
      "ba": {
        "kanji": "決めれば",
        "kana": "きめれば",
        "romaji": "kimereba"
      }
    }
  },
  {
    "id": "katadukeru",
    "kanji": "片付ける",
    "kana": "かたづける",
    "romaji": "katadukeru",
    "english": "to tidy up",
    "indonesian": "merapikan",
    "jlpt": "N4",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "片付ける",
        "kana": "かたづける",
        "romaji": "katadukeru"
      },
      "masu": {
        "kanji": "片付けます",
        "kana": "かたづけます",
        "romaji": "katadukemasu"
      },
      "te": {
        "kanji": "片付けて",
        "kana": "かたづけて",
        "romaji": "katadukete"
      },
      "ta": {
        "kanji": "片付けた",
        "kana": "かたづけた",
        "romaji": "kataduketa"
      },
      "nai": {
        "kanji": "片付けない",
        "kana": "かたづけない",
        "romaji": "katadukenai"
      },
      "potential": {
        "kanji": "片付けられる",
        "kana": "かたづけられる",
        "romaji": "katadukerareru"
      },
      "volitional": {
        "kanji": "片付けよう",
        "kana": "かたづけよう",
        "romaji": "katadukeyou"
      },
      "imperative": {
        "kanji": "片付けろ",
        "kana": "かたづけろ",
        "romaji": "katadukero"
      },
      "prohibitive": {
        "kanji": "片付けるな",
        "kana": "かたづけるな",
        "romaji": "katadukeruna"
      },
      "passive": {
        "kanji": "片付けられる",
        "kana": "かたづけられる",
        "romaji": "katadukerareru"
      },
      "causative": {
        "kanji": "片付けさせる",
        "kana": "かたづけさせる",
        "romaji": "katadukesaseru"
      },
      "causativePassive": {
        "kanji": "片付けさせられる",
        "kana": "かたづけさせられる",
        "romaji": "katadukesaserareru"
      },
      "ba": {
        "kanji": "片付ければ",
        "kana": "かたづければ",
        "romaji": "katadukereba"
      }
    }
  },
  {
    "id": "nureru",
    "kanji": "濡れる",
    "kana": "ぬれる",
    "romaji": "nureru",
    "english": "to get wet",
    "indonesian": "basah / menjadi basah",
    "jlpt": "N3",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "濡れる",
        "kana": "ぬれる",
        "romaji": "nureru"
      },
      "masu": {
        "kanji": "濡れます",
        "kana": "ぬれます",
        "romaji": "nuremasu"
      },
      "te": {
        "kanji": "濡れて",
        "kana": "ぬれて",
        "romaji": "nurete"
      },
      "ta": {
        "kanji": "濡れた",
        "kana": "ぬれた",
        "romaji": "nureta"
      },
      "nai": {
        "kanji": "濡れない",
        "kana": "ぬれない",
        "romaji": "nurenai"
      },
      "potential": {
        "kanji": "濡れられる",
        "kana": "ぬれられる",
        "romaji": "nurerareru"
      },
      "volitional": {
        "kanji": "濡れよう",
        "kana": "ぬれよう",
        "romaji": "nureyou"
      },
      "imperative": {
        "kanji": "濡れろ",
        "kana": "ぬれろ",
        "romaji": "nurero"
      },
      "prohibitive": {
        "kanji": "濡れるな",
        "kana": "ぬれるな",
        "romaji": "nureruna"
      },
      "passive": {
        "kanji": "濡れられる",
        "kana": "ぬれられる",
        "romaji": "nurerareru"
      },
      "causative": {
        "kanji": "濡れさせる",
        "kana": "ぬれさせる",
        "romaji": "nuresaseru"
      },
      "causativePassive": {
        "kanji": "濡れさせられる",
        "kana": "ぬれさせられる",
        "romaji": "nuresaserareru"
      },
      "ba": {
        "kanji": "濡れれば",
        "kana": "ぬれれば",
        "romaji": "nurereba"
      }
    }
  },
  {
    "id": "homeru",
    "kanji": "褒める",
    "kana": "ほめる",
    "romaji": "homeru",
    "english": "to praise",
    "indonesian": "memuji",
    "jlpt": "N4",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "褒める",
        "kana": "ほめる",
        "romaji": "homeru"
      },
      "masu": {
        "kanji": "褒めます",
        "kana": "ほめます",
        "romaji": "homemasu"
      },
      "te": {
        "kanji": "褒めて",
        "kana": "ほめて",
        "romaji": "homete"
      },
      "ta": {
        "kanji": "褒めた",
        "kana": "ほめた",
        "romaji": "hometa"
      },
      "nai": {
        "kanji": "褒めない",
        "kana": "ほめない",
        "romaji": "homenai"
      },
      "potential": {
        "kanji": "褒められる",
        "kana": "ほめられる",
        "romaji": "homerareru"
      },
      "volitional": {
        "kanji": "褒めよう",
        "kana": "ほめよう",
        "romaji": "homeyou"
      },
      "imperative": {
        "kanji": "褒めろ",
        "kana": "ほめろ",
        "romaji": "homero"
      },
      "prohibitive": {
        "kanji": "褒めるな",
        "kana": "ほめるな",
        "romaji": "homeruna"
      },
      "passive": {
        "kanji": "褒められる",
        "kana": "ほめられる",
        "romaji": "homerareru"
      },
      "causative": {
        "kanji": "褒めさせる",
        "kana": "ほめさせる",
        "romaji": "homesaseru"
      },
      "causativePassive": {
        "kanji": "褒めさせられる",
        "kana": "ほめさせられる",
        "romaji": "homesaserareru"
      },
      "ba": {
        "kanji": "褒めれば",
        "kana": "ほめれば",
        "romaji": "homereba"
      }
    }
  },
  {
    "id": "shinjiru_2",
    "kanji": "信じる",
    "kana": "しんじる",
    "romaji": "shinjiru",
    "english": "to believe",
    "indonesian": "mempercayai",
    "jlpt": "N3",
    "group": 2,
    "subGroup": "ru-ichidan",
    "conjugations": {
      "dictionary": {
        "kanji": "信じる",
        "kana": "しんじる",
        "romaji": "shinjiru"
      },
      "masu": {
        "kanji": "信じます",
        "kana": "しんじます",
        "romaji": "shinjimasu"
      },
      "te": {
        "kanji": "信じて",
        "kana": "しんじて",
        "romaji": "shinjite"
      },
      "ta": {
        "kanji": "信じた",
        "kana": "しんじた",
        "romaji": "shinjita"
      },
      "nai": {
        "kanji": "信じない",
        "kana": "しんじない",
        "romaji": "shinjinai"
      },
      "potential": {
        "kanji": "信じられる",
        "kana": "しんじられる",
        "romaji": "shinjirareru"
      },
      "volitional": {
        "kanji": "信じよう",
        "kana": "しんじよう",
        "romaji": "shinjiyou"
      },
      "imperative": {
        "kanji": "信じろ",
        "kana": "しんじろ",
        "romaji": "shinjiro"
      },
      "prohibitive": {
        "kanji": "信じるな",
        "kana": "しんじるな",
        "romaji": "shinjiruna"
      },
      "passive": {
        "kanji": "信じられる",
        "kana": "しんじられる",
        "romaji": "shinjirareru"
      },
      "causative": {
        "kanji": "信じさせる",
        "kana": "しんじさせる",
        "romaji": "shinjisaseru"
      },
      "causativePassive": {
        "kanji": "信じさせられる",
        "kana": "しんじさせられる",
        "romaji": "shinjisaserareru"
      },
      "ba": {
        "kanji": "信じれば",
        "kana": "しんじれば",
        "romaji": "shinjireba"
      }
    }
  },
  {
    "id": "kau",
    "kanji": "買う",
    "kana": "かう",
    "romaji": "kau",
    "english": "to buy",
    "indonesian": "membeli",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "買う",
        "kana": "かう",
        "romaji": "kau"
      },
      "masu": {
        "kanji": "買います",
        "kana": "かいます",
        "romaji": "kaimasu"
      },
      "te": {
        "kanji": "買って",
        "kana": "かって",
        "romaji": "katte"
      },
      "ta": {
        "kanji": "買った",
        "kana": "かった",
        "romaji": "katta"
      },
      "nai": {
        "kanji": "買わない",
        "kana": "かわない",
        "romaji": "kawanai"
      },
      "potential": {
        "kanji": "買える",
        "kana": "かえる",
        "romaji": "kaeru"
      },
      "volitional": {
        "kanji": "買おう",
        "kana": "かおう",
        "romaji": "kaou"
      },
      "imperative": {
        "kanji": "買え",
        "kana": "かえ",
        "romaji": "kae"
      },
      "prohibitive": {
        "kanji": "買うな",
        "kana": "かうな",
        "romaji": "kauna"
      },
      "passive": {
        "kanji": "買われる",
        "kana": "かわれる",
        "romaji": "kawareru"
      },
      "causative": {
        "kanji": "買わせる",
        "kana": "かわせる",
        "romaji": "kawaseru"
      },
      "causativePassive": {
        "kanji": "買わされる",
        "kana": "かわされる",
        "romaji": "kawasareru"
      },
      "ba": {
        "kanji": "買えば",
        "kana": "かえば",
        "romaji": "kaeba"
      }
    }
  },
  {
    "id": "utau",
    "kanji": "歌う",
    "kana": "うたう",
    "romaji": "utau",
    "english": "to sing",
    "indonesian": "bernyanyi",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "歌う",
        "kana": "うたう",
        "romaji": "utau"
      },
      "masu": {
        "kanji": "歌います",
        "kana": "うたいます",
        "romaji": "utaimasu"
      },
      "te": {
        "kanji": "歌って",
        "kana": "うたって",
        "romaji": "utatte"
      },
      "ta": {
        "kanji": "歌った",
        "kana": "うたった",
        "romaji": "utatta"
      },
      "nai": {
        "kanji": "歌わない",
        "kana": "うたわない",
        "romaji": "utawanai"
      },
      "potential": {
        "kanji": "歌える",
        "kana": "うたえる",
        "romaji": "utaeru"
      },
      "volitional": {
        "kanji": "歌おう",
        "kana": "うたおう",
        "romaji": "utaou"
      },
      "imperative": {
        "kanji": "歌え",
        "kana": "うたえ",
        "romaji": "utae"
      },
      "prohibitive": {
        "kanji": "歌うな",
        "kana": "うたうな",
        "romaji": "utauna"
      },
      "passive": {
        "kanji": "歌われる",
        "kana": "うたわれる",
        "romaji": "utawareru"
      },
      "causative": {
        "kanji": "歌わせる",
        "kana": "うたわせる",
        "romaji": "utawaseru"
      },
      "causativePassive": {
        "kanji": "歌わされる",
        "kana": "うたわされる",
        "romaji": "utawasareru"
      },
      "ba": {
        "kanji": "歌えば",
        "kana": "うたえば",
        "romaji": "utaeba"
      }
    }
  },
  {
    "id": "tsukau",
    "kanji": "使う",
    "kana": "つかう",
    "romaji": "tsukau",
    "english": "to use",
    "indonesian": "menggunakan",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "使う",
        "kana": "つかう",
        "romaji": "tsukau"
      },
      "masu": {
        "kanji": "使います",
        "kana": "つかいます",
        "romaji": "tsukaimasu"
      },
      "te": {
        "kanji": "使って",
        "kana": "つかって",
        "romaji": "tsukatte"
      },
      "ta": {
        "kanji": "使った",
        "kana": "つかった",
        "romaji": "tsukatta"
      },
      "nai": {
        "kanji": "使わない",
        "kana": "つかわない",
        "romaji": "tsukawanai"
      },
      "potential": {
        "kanji": "使える",
        "kana": "つかえる",
        "romaji": "tsukaeru"
      },
      "volitional": {
        "kanji": "使おう",
        "kana": "つかおう",
        "romaji": "tsukaou"
      },
      "imperative": {
        "kanji": "使え",
        "kana": "つかえ",
        "romaji": "tsukae"
      },
      "prohibitive": {
        "kanji": "使うな",
        "kana": "つかうな",
        "romaji": "tsukauna"
      },
      "passive": {
        "kanji": "使われる",
        "kana": "つかわれる",
        "romaji": "tsukawareru"
      },
      "causative": {
        "kanji": "使わせる",
        "kana": "つかわせる",
        "romaji": "tsukawaseru"
      },
      "causativePassive": {
        "kanji": "使わされる",
        "kana": "つかわされる",
        "romaji": "tsukawasareru"
      },
      "ba": {
        "kanji": "使えば",
        "kana": "つかえば",
        "romaji": "tsukaeba"
      }
    }
  },
  {
    "id": "au",
    "kanji": "会う",
    "kana": "あう",
    "romaji": "au",
    "english": "to meet",
    "indonesian": "bertemu",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "会う",
        "kana": "あう",
        "romaji": "au"
      },
      "masu": {
        "kanji": "会います",
        "kana": "あいます",
        "romaji": "aimasu"
      },
      "te": {
        "kanji": "会って",
        "kana": "あって",
        "romaji": "atte"
      },
      "ta": {
        "kanji": "会った",
        "kana": "あった",
        "romaji": "atta"
      },
      "nai": {
        "kanji": "会わない",
        "kana": "あわない",
        "romaji": "awanai"
      },
      "potential": {
        "kanji": "会える",
        "kana": "あえる",
        "romaji": "aeru"
      },
      "volitional": {
        "kanji": "会おう",
        "kana": "あおう",
        "romaji": "aou"
      },
      "imperative": {
        "kanji": "会え",
        "kana": "あえ",
        "romaji": "ae"
      },
      "prohibitive": {
        "kanji": "会うな",
        "kana": "あうな",
        "romaji": "auna"
      },
      "passive": {
        "kanji": "会われる",
        "kana": "あわれる",
        "romaji": "awareru"
      },
      "causative": {
        "kanji": "会わせる",
        "kana": "あわせる",
        "romaji": "awaseru"
      },
      "causativePassive": {
        "kanji": "会わされる",
        "kana": "あわされる",
        "romaji": "awasareru"
      },
      "ba": {
        "kanji": "会えば",
        "kana": "あえば",
        "romaji": "aeba"
      }
    }
  },
  {
    "id": "omou",
    "kanji": "思う",
    "kana": "おもう",
    "romaji": "omou",
    "english": "to think",
    "indonesian": "berpikir / mengira",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "思う",
        "kana": "おもう",
        "romaji": "omou"
      },
      "masu": {
        "kanji": "思います",
        "kana": "おもいます",
        "romaji": "omoimasu"
      },
      "te": {
        "kanji": "思って",
        "kana": "おもって",
        "romaji": "omotte"
      },
      "ta": {
        "kanji": "思った",
        "kana": "おもった",
        "romaji": "omotta"
      },
      "nai": {
        "kanji": "思わない",
        "kana": "おもわない",
        "romaji": "omowanai"
      },
      "potential": {
        "kanji": "思える",
        "kana": "おもえる",
        "romaji": "omoeru"
      },
      "volitional": {
        "kanji": "思おう",
        "kana": "おもおう",
        "romaji": "omoou"
      },
      "imperative": {
        "kanji": "思え",
        "kana": "おもえ",
        "romaji": "omoe"
      },
      "prohibitive": {
        "kanji": "思うな",
        "kana": "おもうな",
        "romaji": "omouna"
      },
      "passive": {
        "kanji": "思われる",
        "kana": "おもわれる",
        "romaji": "omowareru"
      },
      "causative": {
        "kanji": "思わせる",
        "kana": "おもわせる",
        "romaji": "omowaseru"
      },
      "causativePassive": {
        "kanji": "思わされる",
        "kana": "おもわされる",
        "romaji": "omowasareru"
      },
      "ba": {
        "kanji": "思えば",
        "kana": "おもえば",
        "romaji": "omoeba"
      }
    }
  },
  {
    "id": "iu",
    "kanji": "言う",
    "kana": "いう",
    "romaji": "iu",
    "english": "to say",
    "indonesian": "mengatakan",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "言う",
        "kana": "いう",
        "romaji": "iu"
      },
      "masu": {
        "kanji": "言います",
        "kana": "いいます",
        "romaji": "iimasu"
      },
      "te": {
        "kanji": "言って",
        "kana": "いって",
        "romaji": "itte"
      },
      "ta": {
        "kanji": "言った",
        "kana": "いった",
        "romaji": "itta"
      },
      "nai": {
        "kanji": "言わない",
        "kana": "いわない",
        "romaji": "iwanai"
      },
      "potential": {
        "kanji": "言える",
        "kana": "いえる",
        "romaji": "ieru"
      },
      "volitional": {
        "kanji": "言おう",
        "kana": "いおう",
        "romaji": "iou"
      },
      "imperative": {
        "kanji": "言え",
        "kana": "いえ",
        "romaji": "ie"
      },
      "prohibitive": {
        "kanji": "言うな",
        "kana": "いうな",
        "romaji": "iuna"
      },
      "passive": {
        "kanji": "言われる",
        "kana": "いわれる",
        "romaji": "iwareru"
      },
      "causative": {
        "kanji": "言わせる",
        "kana": "いわせる",
        "romaji": "iwaseru"
      },
      "causativePassive": {
        "kanji": "言わされる",
        "kana": "いわされる",
        "romaji": "iwasareru"
      },
      "ba": {
        "kanji": "言えば",
        "kana": "いえば",
        "romaji": "ieba"
      }
    }
  },
  {
    "id": "warau",
    "kanji": "笑う",
    "kana": "わらう",
    "romaji": "warau",
    "english": "to laugh",
    "indonesian": "tertawa",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "笑う",
        "kana": "わらう",
        "romaji": "warau"
      },
      "masu": {
        "kanji": "笑います",
        "kana": "わらいます",
        "romaji": "waraimasu"
      },
      "te": {
        "kanji": "笑って",
        "kana": "わらって",
        "romaji": "waratte"
      },
      "ta": {
        "kanji": "笑った",
        "kana": "わらった",
        "romaji": "waratta"
      },
      "nai": {
        "kanji": "笑わない",
        "kana": "わらわない",
        "romaji": "warawanai"
      },
      "potential": {
        "kanji": "笑える",
        "kana": "わらえる",
        "romaji": "waraeru"
      },
      "volitional": {
        "kanji": "笑おう",
        "kana": "わらおう",
        "romaji": "waraou"
      },
      "imperative": {
        "kanji": "笑え",
        "kana": "わらえ",
        "romaji": "warae"
      },
      "prohibitive": {
        "kanji": "笑うな",
        "kana": "わらうな",
        "romaji": "warauna"
      },
      "passive": {
        "kanji": "笑われる",
        "kana": "わらわれる",
        "romaji": "warawareru"
      },
      "causative": {
        "kanji": "笑わせる",
        "kana": "わらわせる",
        "romaji": "warawaseru"
      },
      "causativePassive": {
        "kanji": "笑わされる",
        "kana": "わらわされる",
        "romaji": "warawasareru"
      },
      "ba": {
        "kanji": "笑えば",
        "kana": "わらえば",
        "romaji": "waraeba"
      }
    }
  },
  {
    "id": "narau",
    "kanji": "習う",
    "kana": "ならう",
    "romaji": "narau",
    "english": "to learn",
    "indonesian": "belajar (dari guru)",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "習う",
        "kana": "ならう",
        "romaji": "narau"
      },
      "masu": {
        "kanji": "習います",
        "kana": "ならいます",
        "romaji": "naraimasu"
      },
      "te": {
        "kanji": "習って",
        "kana": "ならって",
        "romaji": "naratte"
      },
      "ta": {
        "kanji": "習った",
        "kana": "ならった",
        "romaji": "naratta"
      },
      "nai": {
        "kanji": "習わない",
        "kana": "ならわない",
        "romaji": "narawanai"
      },
      "potential": {
        "kanji": "習える",
        "kana": "ならえる",
        "romaji": "naraeru"
      },
      "volitional": {
        "kanji": "習おう",
        "kana": "ならおう",
        "romaji": "naraou"
      },
      "imperative": {
        "kanji": "習え",
        "kana": "ならえ",
        "romaji": "narae"
      },
      "prohibitive": {
        "kanji": "習うな",
        "kana": "ならうな",
        "romaji": "narauna"
      },
      "passive": {
        "kanji": "習われる",
        "kana": "ならわれる",
        "romaji": "narawareru"
      },
      "causative": {
        "kanji": "習わせる",
        "kana": "ならわせる",
        "romaji": "narawaseru"
      },
      "causativePassive": {
        "kanji": "習わされる",
        "kana": "ならわされる",
        "romaji": "narawasareru"
      },
      "ba": {
        "kanji": "習えば",
        "kana": "ならえば",
        "romaji": "naraeba"
      }
    }
  },
  {
    "id": "harau",
    "kanji": "払う",
    "kana": "はらう",
    "romaji": "harau",
    "english": "to pay",
    "indonesian": "membayar",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "払う",
        "kana": "はらう",
        "romaji": "harau"
      },
      "masu": {
        "kanji": "払います",
        "kana": "はらいます",
        "romaji": "haraimasu"
      },
      "te": {
        "kanji": "払って",
        "kana": "はらって",
        "romaji": "haratte"
      },
      "ta": {
        "kanji": "払った",
        "kana": "はらった",
        "romaji": "haratta"
      },
      "nai": {
        "kanji": "払わない",
        "kana": "はらわない",
        "romaji": "harawanai"
      },
      "potential": {
        "kanji": "払える",
        "kana": "はらえる",
        "romaji": "haraeru"
      },
      "volitional": {
        "kanji": "払おう",
        "kana": "はらおう",
        "romaji": "haraou"
      },
      "imperative": {
        "kanji": "払え",
        "kana": "はらえ",
        "romaji": "harae"
      },
      "prohibitive": {
        "kanji": "払うな",
        "kana": "はらうな",
        "romaji": "harauna"
      },
      "passive": {
        "kanji": "払われる",
        "kana": "はらわれる",
        "romaji": "harawareru"
      },
      "causative": {
        "kanji": "払わせる",
        "kana": "はらわせる",
        "romaji": "harawaseru"
      },
      "causativePassive": {
        "kanji": "払わされる",
        "kana": "はらわされる",
        "romaji": "harawasareru"
      },
      "ba": {
        "kanji": "払えば",
        "kana": "はらえば",
        "romaji": "haraeba"
      }
    }
  },
  {
    "id": "morau",
    "kanji": "貰う",
    "kana": "もらう",
    "romaji": "morau",
    "english": "to receive",
    "indonesian": "menerima",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "貰う",
        "kana": "もらう",
        "romaji": "morau"
      },
      "masu": {
        "kanji": "貰います",
        "kana": "もらいます",
        "romaji": "moraimasu"
      },
      "te": {
        "kanji": "貰って",
        "kana": "もらって",
        "romaji": "moratte"
      },
      "ta": {
        "kanji": "貰った",
        "kana": "もらった",
        "romaji": "moratta"
      },
      "nai": {
        "kanji": "貰わない",
        "kana": "もらわない",
        "romaji": "morawanai"
      },
      "potential": {
        "kanji": "貰える",
        "kana": "もらえる",
        "romaji": "moraeru"
      },
      "volitional": {
        "kanji": "貰おう",
        "kana": "もらおう",
        "romaji": "moraou"
      },
      "imperative": {
        "kanji": "貰え",
        "kana": "もらえ",
        "romaji": "morae"
      },
      "prohibitive": {
        "kanji": "貰うな",
        "kana": "もらうな",
        "romaji": "morauna"
      },
      "passive": {
        "kanji": "貰われる",
        "kana": "もらわれる",
        "romaji": "morawareru"
      },
      "causative": {
        "kanji": "貰わせる",
        "kana": "もらわせる",
        "romaji": "morawaseru"
      },
      "causativePassive": {
        "kanji": "貰わされる",
        "kana": "もらわされる",
        "romaji": "morawasareru"
      },
      "ba": {
        "kanji": "貰えば",
        "kana": "もらえば",
        "romaji": "moraeba"
      }
    }
  },
  {
    "id": "chigau",
    "kanji": "違う",
    "kana": "ちがう",
    "romaji": "chigau",
    "english": "to differ / be wrong",
    "indonesian": "berbeda / salah",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "違う",
        "kana": "ちがう",
        "romaji": "chigau"
      },
      "masu": {
        "kanji": "違います",
        "kana": "ちがいます",
        "romaji": "chigaimasu"
      },
      "te": {
        "kanji": "違って",
        "kana": "ちがって",
        "romaji": "chigatte"
      },
      "ta": {
        "kanji": "違った",
        "kana": "ちがった",
        "romaji": "chigatta"
      },
      "nai": {
        "kanji": "違わない",
        "kana": "ちがわない",
        "romaji": "chigawanai"
      },
      "potential": {
        "kanji": "違える",
        "kana": "ちがえる",
        "romaji": "chigaeru"
      },
      "volitional": {
        "kanji": "違おう",
        "kana": "ちがおう",
        "romaji": "chigaou"
      },
      "imperative": {
        "kanji": "違え",
        "kana": "ちがえ",
        "romaji": "chigae"
      },
      "prohibitive": {
        "kanji": "違うな",
        "kana": "ちがうな",
        "romaji": "chigauna"
      },
      "passive": {
        "kanji": "違われる",
        "kana": "ちがわれる",
        "romaji": "chigawareru"
      },
      "causative": {
        "kanji": "違わせる",
        "kana": "ちがわせる",
        "romaji": "chigawaseru"
      },
      "causativePassive": {
        "kanji": "違わされる",
        "kana": "ちがわされる",
        "romaji": "chigawasareru"
      },
      "ba": {
        "kanji": "違えば",
        "kana": "ちがえば",
        "romaji": "chigaeba"
      }
    }
  },
  {
    "id": "suu",
    "kanji": "吸う",
    "kana": "すう",
    "romaji": "suu",
    "english": "to smoke / inhale",
    "indonesian": "merokok / menghirup",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "吸う",
        "kana": "すう",
        "romaji": "suu"
      },
      "masu": {
        "kanji": "吸います",
        "kana": "すいます",
        "romaji": "suimasu"
      },
      "te": {
        "kanji": "吸って",
        "kana": "すって",
        "romaji": "sutte"
      },
      "ta": {
        "kanji": "吸った",
        "kana": "すった",
        "romaji": "sutta"
      },
      "nai": {
        "kanji": "吸わない",
        "kana": "すわない",
        "romaji": "suwanai"
      },
      "potential": {
        "kanji": "吸える",
        "kana": "すえる",
        "romaji": "sueru"
      },
      "volitional": {
        "kanji": "吸おう",
        "kana": "すおう",
        "romaji": "suou"
      },
      "imperative": {
        "kanji": "吸え",
        "kana": "すえ",
        "romaji": "sue"
      },
      "prohibitive": {
        "kanji": "吸うな",
        "kana": "すうな",
        "romaji": "suuna"
      },
      "passive": {
        "kanji": "吸われる",
        "kana": "すわれる",
        "romaji": "suwareru"
      },
      "causative": {
        "kanji": "吸わせる",
        "kana": "すわせる",
        "romaji": "suwaseru"
      },
      "causativePassive": {
        "kanji": "吸わされる",
        "kana": "すわされる",
        "romaji": "suwasareru"
      },
      "ba": {
        "kanji": "吸えば",
        "kana": "すえば",
        "romaji": "sueba"
      }
    }
  },
  {
    "id": "au_fit",
    "kanji": "合う",
    "kana": "あう",
    "romaji": "au",
    "english": "to fit / match",
    "indonesian": "cocok / sesuai",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "合う",
        "kana": "あう",
        "romaji": "au"
      },
      "masu": {
        "kanji": "合います",
        "kana": "あいます",
        "romaji": "aimasu"
      },
      "te": {
        "kanji": "合って",
        "kana": "あって",
        "romaji": "atte"
      },
      "ta": {
        "kanji": "合った",
        "kana": "あった",
        "romaji": "atta"
      },
      "nai": {
        "kanji": "合わない",
        "kana": "あわない",
        "romaji": "awanai"
      },
      "potential": {
        "kanji": "合える",
        "kana": "あえる",
        "romaji": "aeru"
      },
      "volitional": {
        "kanji": "合おう",
        "kana": "あおう",
        "romaji": "aou"
      },
      "imperative": {
        "kanji": "合え",
        "kana": "あえ",
        "romaji": "ae"
      },
      "prohibitive": {
        "kanji": "合うな",
        "kana": "あうな",
        "romaji": "auna"
      },
      "passive": {
        "kanji": "合われる",
        "kana": "あわれる",
        "romaji": "awareru"
      },
      "causative": {
        "kanji": "合わせる",
        "kana": "あわせる",
        "romaji": "awaseru"
      },
      "causativePassive": {
        "kanji": "合わされる",
        "kana": "あわされる",
        "romaji": "awasareru"
      },
      "ba": {
        "kanji": "合えば",
        "kana": "あえば",
        "romaji": "aeba"
      }
    }
  },
  {
    "id": "omou_opinion",
    "kanji": "想う",
    "kana": "おもう",
    "romaji": "omou",
    "english": "to think of / love",
    "indonesian": "memikirkan",
    "jlpt": "N2",
    "group": 1,
    "subGroup": "u",
    "conjugations": {
      "dictionary": {
        "kanji": "想う",
        "kana": "おもう",
        "romaji": "omou"
      },
      "masu": {
        "kanji": "想います",
        "kana": "おもいます",
        "romaji": "omoimasu"
      },
      "te": {
        "kanji": "想って",
        "kana": "おもって",
        "romaji": "omotte"
      },
      "ta": {
        "kanji": "想った",
        "kana": "おもった",
        "romaji": "omotta"
      },
      "nai": {
        "kanji": "想わない",
        "kana": "おもわない",
        "romaji": "omowanai"
      },
      "potential": {
        "kanji": "想える",
        "kana": "おもえる",
        "romaji": "omoeru"
      },
      "volitional": {
        "kanji": "想おう",
        "kana": "おもおう",
        "romaji": "omoou"
      },
      "imperative": {
        "kanji": "想え",
        "kana": "おもえ",
        "romaji": "omoe"
      },
      "prohibitive": {
        "kanji": "想うな",
        "kana": "おもうな",
        "romaji": "omouna"
      },
      "passive": {
        "kanji": "想われる",
        "kana": "おもわれる",
        "romaji": "omowareru"
      },
      "causative": {
        "kanji": "想わせる",
        "kana": "おもわせる",
        "romaji": "omowaseru"
      },
      "causativePassive": {
        "kanji": "想わされる",
        "kana": "おもわされる",
        "romaji": "omowasareru"
      },
      "ba": {
        "kanji": "想えば",
        "kana": "おもえば",
        "romaji": "omoeba"
      }
    }
  },
  {
    "id": "matsu",
    "kanji": "待つ",
    "kana": "まつ",
    "romaji": "matsu",
    "english": "to wait",
    "indonesian": "menunggu",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "tsu",
    "conjugations": {
      "dictionary": {
        "kanji": "待つ",
        "kana": "まつ",
        "romaji": "matsu"
      },
      "masu": {
        "kanji": "待ちます",
        "kana": "まちます",
        "romaji": "machimasu"
      },
      "te": {
        "kanji": "待って",
        "kana": "まって",
        "romaji": "matte"
      },
      "ta": {
        "kanji": "待った",
        "kana": "まった",
        "romaji": "matta"
      },
      "nai": {
        "kanji": "待たない",
        "kana": "またない",
        "romaji": "matanai"
      },
      "potential": {
        "kanji": "待てる",
        "kana": "まてる",
        "romaji": "materu"
      },
      "volitional": {
        "kanji": "待とう",
        "kana": "まとう",
        "romaji": "matou"
      },
      "imperative": {
        "kanji": "待て",
        "kana": "まて",
        "romaji": "mate"
      },
      "prohibitive": {
        "kanji": "待つな",
        "kana": "まつな",
        "romaji": "matsuna"
      },
      "passive": {
        "kanji": "待たれる",
        "kana": "またれる",
        "romaji": "matareru"
      },
      "causative": {
        "kanji": "待たせる",
        "kana": "またせる",
        "romaji": "mataseru"
      },
      "causativePassive": {
        "kanji": "待たされる",
        "kana": "またされる",
        "romaji": "matasareru"
      },
      "ba": {
        "kanji": "待てば",
        "kana": "まてば",
        "romaji": "mateba"
      }
    }
  },
  {
    "id": "tatsu",
    "kanji": "立つ",
    "kana": "たつ",
    "romaji": "tatsu",
    "english": "to stand",
    "indonesian": "berdiri",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "tsu",
    "conjugations": {
      "dictionary": {
        "kanji": "立つ",
        "kana": "たつ",
        "romaji": "tatsu"
      },
      "masu": {
        "kanji": "立ちます",
        "kana": "たちます",
        "romaji": "tachimasu"
      },
      "te": {
        "kanji": "立って",
        "kana": "たって",
        "romaji": "tatte"
      },
      "ta": {
        "kanji": "立った",
        "kana": "たった",
        "romaji": "tatta"
      },
      "nai": {
        "kanji": "立たない",
        "kana": "たたない",
        "romaji": "tatanai"
      },
      "potential": {
        "kanji": "立てる",
        "kana": "たてる",
        "romaji": "tateru"
      },
      "volitional": {
        "kanji": "立とう",
        "kana": "たとう",
        "romaji": "tatou"
      },
      "imperative": {
        "kanji": "立て",
        "kana": "たて",
        "romaji": "tate"
      },
      "prohibitive": {
        "kanji": "立つな",
        "kana": "たつな",
        "romaji": "tatsuna"
      },
      "passive": {
        "kanji": "立たれる",
        "kana": "たたれる",
        "romaji": "tatareru"
      },
      "causative": {
        "kanji": "立たせる",
        "kana": "たたせる",
        "romaji": "tataseru"
      },
      "causativePassive": {
        "kanji": "立たされる",
        "kana": "たたされる",
        "romaji": "tatasareru"
      },
      "ba": {
        "kanji": "立てば",
        "kana": "たてば",
        "romaji": "tateba"
      }
    }
  },
  {
    "id": "motsu",
    "kanji": "持つ",
    "kana": "もつ",
    "romaji": "motsu",
    "english": "to hold / carry",
    "indonesian": "membawa / memiliki",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "tsu",
    "conjugations": {
      "dictionary": {
        "kanji": "持つ",
        "kana": "もつ",
        "romaji": "motsu"
      },
      "masu": {
        "kanji": "持ちます",
        "kana": "もちます",
        "romaji": "mochimasu"
      },
      "te": {
        "kanji": "持って",
        "kana": "もって",
        "romaji": "motte"
      },
      "ta": {
        "kanji": "持った",
        "kana": "もった",
        "romaji": "motta"
      },
      "nai": {
        "kanji": "持たない",
        "kana": "もたない",
        "romaji": "motanai"
      },
      "potential": {
        "kanji": "持てる",
        "kana": "もてる",
        "romaji": "moteru"
      },
      "volitional": {
        "kanji": "持とう",
        "kana": "もとう",
        "romaji": "motou"
      },
      "imperative": {
        "kanji": "持て",
        "kana": "もて",
        "romaji": "mote"
      },
      "prohibitive": {
        "kanji": "持つな",
        "kana": "もつな",
        "romaji": "motsuna"
      },
      "passive": {
        "kanji": "持たれる",
        "kana": "もたれる",
        "romaji": "motareru"
      },
      "causative": {
        "kanji": "持たせる",
        "kana": "もたせる",
        "romaji": "motaseru"
      },
      "causativePassive": {
        "kanji": "持たされる",
        "kana": "もたされる",
        "romaji": "motasareru"
      },
      "ba": {
        "kanji": "持てば",
        "kana": "もてば",
        "romaji": "moteba"
      }
    }
  },
  {
    "id": "katsu",
    "kanji": "勝つ",
    "kana": "かつ",
    "romaji": "katsu",
    "english": "to win",
    "indonesian": "menang",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "tsu",
    "conjugations": {
      "dictionary": {
        "kanji": "勝つ",
        "kana": "かつ",
        "romaji": "katsu"
      },
      "masu": {
        "kanji": "勝ちます",
        "kana": "かちます",
        "romaji": "kachimasu"
      },
      "te": {
        "kanji": "勝って",
        "kana": "かって",
        "romaji": "katte"
      },
      "ta": {
        "kanji": "勝った",
        "kana": "かった",
        "romaji": "katta"
      },
      "nai": {
        "kanji": "勝たない",
        "kana": "かたない",
        "romaji": "katanai"
      },
      "potential": {
        "kanji": "勝てる",
        "kana": "かてる",
        "romaji": "kateru"
      },
      "volitional": {
        "kanji": "勝とう",
        "kana": "かとう",
        "romaji": "katou"
      },
      "imperative": {
        "kanji": "勝て",
        "kana": "かて",
        "romaji": "kate"
      },
      "prohibitive": {
        "kanji": "勝つな",
        "kana": "かつな",
        "romaji": "katsuna"
      },
      "passive": {
        "kanji": "勝たれる",
        "kana": "かたれる",
        "romaji": "katareru"
      },
      "causative": {
        "kanji": "勝たせる",
        "kana": "かたせる",
        "romaji": "kataseru"
      },
      "causativePassive": {
        "kanji": "勝たされる",
        "kana": "かたされる",
        "romaji": "katasareru"
      },
      "ba": {
        "kanji": "勝てば",
        "kana": "かてば",
        "romaji": "kateba"
      }
    }
  },
  {
    "id": "utsu",
    "kanji": "打つ",
    "kana": "うつ",
    "romaji": "utsu",
    "english": "to hit / strike",
    "indonesian": "memukul",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "tsu",
    "conjugations": {
      "dictionary": {
        "kanji": "打つ",
        "kana": "うつ",
        "romaji": "utsu"
      },
      "masu": {
        "kanji": "打ちます",
        "kana": "うちます",
        "romaji": "uchimasu"
      },
      "te": {
        "kanji": "打って",
        "kana": "うって",
        "romaji": "utte"
      },
      "ta": {
        "kanji": "打った",
        "kana": "うった",
        "romaji": "utta"
      },
      "nai": {
        "kanji": "打たない",
        "kana": "うたない",
        "romaji": "utanai"
      },
      "potential": {
        "kanji": "打てる",
        "kana": "うてる",
        "romaji": "uteru"
      },
      "volitional": {
        "kanji": "打とう",
        "kana": "うとう",
        "romaji": "utou"
      },
      "imperative": {
        "kanji": "打て",
        "kana": "うて",
        "romaji": "ute"
      },
      "prohibitive": {
        "kanji": "打つな",
        "kana": "うつな",
        "romaji": "utsuna"
      },
      "passive": {
        "kanji": "打たれる",
        "kana": "うたれる",
        "romaji": "utareru"
      },
      "causative": {
        "kanji": "打たせる",
        "kana": "うたせる",
        "romaji": "utaseru"
      },
      "causativePassive": {
        "kanji": "打たされる",
        "kana": "うたされる",
        "romaji": "utasareru"
      },
      "ba": {
        "kanji": "打てば",
        "kana": "うてば",
        "romaji": "uteba"
      }
    }
  },
  {
    "id": "sodatsu",
    "kanji": "育つ",
    "kana": "そだつ",
    "romaji": "sodatsu",
    "english": "to grow up",
    "indonesian": "tumbuh besar",
    "jlpt": "N3",
    "group": 1,
    "subGroup": "tsu",
    "conjugations": {
      "dictionary": {
        "kanji": "育つ",
        "kana": "そだつ",
        "romaji": "sodatsu"
      },
      "masu": {
        "kanji": "育ちます",
        "kana": "そだちます",
        "romaji": "sodachimasu"
      },
      "te": {
        "kanji": "育って",
        "kana": "そだって",
        "romaji": "sodatte"
      },
      "ta": {
        "kanji": "育った",
        "kana": "そだった",
        "romaji": "sodatta"
      },
      "nai": {
        "kanji": "育たない",
        "kana": "そだたない",
        "romaji": "sodatanai"
      },
      "potential": {
        "kanji": "育てる",
        "kana": "そだてる",
        "romaji": "sodateru"
      },
      "volitional": {
        "kanji": "育とう",
        "kana": "そだとう",
        "romaji": "sodatou"
      },
      "imperative": {
        "kanji": "育て",
        "kana": "そだて",
        "romaji": "sodate"
      },
      "prohibitive": {
        "kanji": "育つな",
        "kana": "そだつな",
        "romaji": "sodatsuna"
      },
      "passive": {
        "kanji": "育たれる",
        "kana": "そだたれる",
        "romaji": "sodatareru"
      },
      "causative": {
        "kanji": "育たせる",
        "kana": "そだたせる",
        "romaji": "sodataseru"
      },
      "causativePassive": {
        "kanji": "育たされる",
        "kana": "そだたされる",
        "romaji": "sodatasareru"
      },
      "ba": {
        "kanji": "育てば",
        "kana": "そだてば",
        "romaji": "sodateba"
      }
    }
  },
  {
    "id": "tamotsu",
    "kanji": "保つ",
    "kana": "たもつ",
    "romaji": "tamotsu",
    "english": "to keep / preserve",
    "indonesian": "menjaga / mempertahankan",
    "jlpt": "N2",
    "group": 1,
    "subGroup": "tsu",
    "conjugations": {
      "dictionary": {
        "kanji": "保つ",
        "kana": "たもつ",
        "romaji": "tamotsu"
      },
      "masu": {
        "kanji": "保ちます",
        "kana": "たもちます",
        "romaji": "tamochimasu"
      },
      "te": {
        "kanji": "保って",
        "kana": "たもって",
        "romaji": "tamotte"
      },
      "ta": {
        "kanji": "保った",
        "kana": "たもった",
        "romaji": "tamotta"
      },
      "nai": {
        "kanji": "保たない",
        "kana": "たもたない",
        "romaji": "tamotanai"
      },
      "potential": {
        "kanji": "保てる",
        "kana": "たもてる",
        "romaji": "tamoteru"
      },
      "volitional": {
        "kanji": "保とう",
        "kana": "たもとう",
        "romaji": "tamotou"
      },
      "imperative": {
        "kanji": "保て",
        "kana": "たもて",
        "romaji": "tamote"
      },
      "prohibitive": {
        "kanji": "保つな",
        "kana": "たもつな",
        "romaji": "tamotsuna"
      },
      "passive": {
        "kanji": "保たれる",
        "kana": "たもたれる",
        "romaji": "tamotareru"
      },
      "causative": {
        "kanji": "保たせる",
        "kana": "たもたせる",
        "romaji": "tamotaseru"
      },
      "causativePassive": {
        "kanji": "保たされる",
        "kana": "たもたされる",
        "romaji": "tamotasareru"
      },
      "ba": {
        "kanji": "保てば",
        "kana": "たもてば",
        "romaji": "tamoteba"
      }
    }
  },
  {
    "id": "noru",
    "kanji": "乗る",
    "kana": "のる",
    "romaji": "noru",
    "english": "to ride / board",
    "indonesian": "naik (kendaraan)",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "乗る",
        "kana": "のる",
        "romaji": "noru"
      },
      "masu": {
        "kanji": "乗ります",
        "kana": "のります",
        "romaji": "norimasu"
      },
      "te": {
        "kanji": "乗って",
        "kana": "のって",
        "romaji": "notte"
      },
      "ta": {
        "kanji": "乗った",
        "kana": "のった",
        "romaji": "notta"
      },
      "nai": {
        "kanji": "乗らない",
        "kana": "のらない",
        "romaji": "noranai"
      },
      "potential": {
        "kanji": "乗れる",
        "kana": "のれる",
        "romaji": "noreru"
      },
      "volitional": {
        "kanji": "乗ろう",
        "kana": "のろう",
        "romaji": "norou"
      },
      "imperative": {
        "kanji": "乗れ",
        "kana": "のれ",
        "romaji": "nore"
      },
      "prohibitive": {
        "kanji": "乗るな",
        "kana": "のるな",
        "romaji": "noruna"
      },
      "passive": {
        "kanji": "乗られる",
        "kana": "のられる",
        "romaji": "norareru"
      },
      "causative": {
        "kanji": "乗らせる",
        "kana": "のらせる",
        "romaji": "noraseru"
      },
      "causativePassive": {
        "kanji": "乗らされる",
        "kana": "のらされる",
        "romaji": "norasareru"
      },
      "ba": {
        "kanji": "乗れば",
        "kana": "のれば",
        "romaji": "noreba"
      }
    }
  },
  {
    "id": "tsukuru",
    "kanji": "作る",
    "kana": "つくる",
    "romaji": "tsukuru",
    "english": "to make / create",
    "indonesian": "membuat",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "作る",
        "kana": "つくる",
        "romaji": "tsukuru"
      },
      "masu": {
        "kanji": "作ります",
        "kana": "つくります",
        "romaji": "tsukurimasu"
      },
      "te": {
        "kanji": "作って",
        "kana": "つくって",
        "romaji": "tsukutte"
      },
      "ta": {
        "kanji": "作った",
        "kana": "つくった",
        "romaji": "tsukutta"
      },
      "nai": {
        "kanji": "作らない",
        "kana": "つくらない",
        "romaji": "tsukuranai"
      },
      "potential": {
        "kanji": "作れる",
        "kana": "つくれる",
        "romaji": "tsukureru"
      },
      "volitional": {
        "kanji": "作ろう",
        "kana": "つくろう",
        "romaji": "tsukurou"
      },
      "imperative": {
        "kanji": "作れ",
        "kana": "つくれ",
        "romaji": "tsukure"
      },
      "prohibitive": {
        "kanji": "作るな",
        "kana": "つくるな",
        "romaji": "tsukuruna"
      },
      "passive": {
        "kanji": "作られる",
        "kana": "つくられる",
        "romaji": "tsukurareru"
      },
      "causative": {
        "kanji": "作らせる",
        "kana": "つくらせる",
        "romaji": "tsukuraseru"
      },
      "causativePassive": {
        "kanji": "作らされる",
        "kana": "つくらされる",
        "romaji": "tsukurasareru"
      },
      "ba": {
        "kanji": "作れば",
        "kana": "つくれば",
        "romaji": "tsukureba"
      }
    }
  },
  {
    "id": "furu",
    "kanji": "降る",
    "kana": "ふる",
    "romaji": "furu",
    "english": "to fall (rain/snow)",
    "indonesian": "turun (hujan/salju)",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "降る",
        "kana": "ふる",
        "romaji": "furu"
      },
      "masu": {
        "kanji": "降ります",
        "kana": "ふります",
        "romaji": "furimasu"
      },
      "te": {
        "kanji": "降って",
        "kana": "ふって",
        "romaji": "futte"
      },
      "ta": {
        "kanji": "降った",
        "kana": "ふった",
        "romaji": "futta"
      },
      "nai": {
        "kanji": "降らない",
        "kana": "ふらない",
        "romaji": "furanai"
      },
      "potential": {
        "kanji": "降れる",
        "kana": "ふれる",
        "romaji": "fureru"
      },
      "volitional": {
        "kanji": "降ろう",
        "kana": "ふろう",
        "romaji": "furou"
      },
      "imperative": {
        "kanji": "降れ",
        "kana": "ふれ",
        "romaji": "fure"
      },
      "prohibitive": {
        "kanji": "降るな",
        "kana": "ふるな",
        "romaji": "furuna"
      },
      "passive": {
        "kanji": "降られる",
        "kana": "ふられる",
        "romaji": "furareru"
      },
      "causative": {
        "kanji": "降らせる",
        "kana": "ふらせる",
        "romaji": "furaseru"
      },
      "causativePassive": {
        "kanji": "降らされる",
        "kana": "ふらされる",
        "romaji": "furasareru"
      },
      "ba": {
        "kanji": "降れば",
        "kana": "ふれば",
        "romaji": "fureba"
      }
    }
  },
  {
    "id": "toru",
    "kanji": "取る",
    "kana": "とる",
    "romaji": "toru",
    "english": "to take / get",
    "indonesian": "mengambil / mendapatkan",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "取る",
        "kana": "とる",
        "romaji": "toru"
      },
      "masu": {
        "kanji": "取ります",
        "kana": "とります",
        "romaji": "torimasu"
      },
      "te": {
        "kanji": "取って",
        "kana": "とって",
        "romaji": "totte"
      },
      "ta": {
        "kanji": "取った",
        "kana": "とった",
        "romaji": "totta"
      },
      "nai": {
        "kanji": "取らない",
        "kana": "とらない",
        "romaji": "toranai"
      },
      "potential": {
        "kanji": "取れる",
        "kana": "とれる",
        "romaji": "toreru"
      },
      "volitional": {
        "kanji": "取ろう",
        "kana": "とろう",
        "romaji": "torou"
      },
      "imperative": {
        "kanji": "取れ",
        "kana": "とれ",
        "romaji": "tore"
      },
      "prohibitive": {
        "kanji": "取るな",
        "kana": "とるな",
        "romaji": "toruna"
      },
      "passive": {
        "kanji": "取られる",
        "kana": "とられる",
        "romaji": "torareru"
      },
      "causative": {
        "kanji": "取らせる",
        "kana": "とらせる",
        "romaji": "toraseru"
      },
      "causativePassive": {
        "kanji": "取らされる",
        "kana": "とらされる",
        "romaji": "torasareru"
      },
      "ba": {
        "kanji": "取れば",
        "kana": "とれば",
        "romaji": "toreba"
      }
    }
  },
  {
    "id": "shiru",
    "kanji": "知る",
    "kana": "しる",
    "romaji": "shiru",
    "english": "to know",
    "indonesian": "tahu / mengetahui",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "exception-ru",
    "conjugations": {
      "dictionary": {
        "kanji": "知る",
        "kana": "しる",
        "romaji": "shiru"
      },
      "masu": {
        "kanji": "知ります",
        "kana": "しります",
        "romaji": "shirimasu"
      },
      "te": {
        "kanji": "知って",
        "kana": "しって",
        "romaji": "shitte"
      },
      "ta": {
        "kanji": "知った",
        "kana": "しった",
        "romaji": "shitta"
      },
      "nai": {
        "kanji": "知らない",
        "kana": "しらない",
        "romaji": "shiranai"
      },
      "potential": {
        "kanji": "知れる",
        "kana": "しれる",
        "romaji": "shireru"
      },
      "volitional": {
        "kanji": "知ろう",
        "kana": "しろう",
        "romaji": "shirou"
      },
      "imperative": {
        "kanji": "知れ",
        "kana": "しれ",
        "romaji": "shire"
      },
      "prohibitive": {
        "kanji": "知るな",
        "kana": "しるな",
        "romaji": "shiruna"
      },
      "passive": {
        "kanji": "知られる",
        "kana": "しられる",
        "romaji": "shirareru"
      },
      "causative": {
        "kanji": "知らせる",
        "kana": "しらせる",
        "romaji": "shiraseru"
      },
      "causativePassive": {
        "kanji": "知らされる",
        "kana": "しらされる",
        "romaji": "shirasareru"
      },
      "ba": {
        "kanji": "知れば",
        "kana": "しれば",
        "romaji": "shireba"
      }
    }
  },
  {
    "id": "hashiru",
    "kanji": "走る",
    "kana": "はしる",
    "romaji": "hashiru",
    "english": "to run",
    "indonesian": "berlari",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "exception-ru",
    "conjugations": {
      "dictionary": {
        "kanji": "走る",
        "kana": "はしる",
        "romaji": "hashiru"
      },
      "masu": {
        "kanji": "走ります",
        "kana": "はしります",
        "romaji": "hashirimasu"
      },
      "te": {
        "kanji": "走って",
        "kana": "はしって",
        "romaji": "hashitte"
      },
      "ta": {
        "kanji": "走った",
        "kana": "はしった",
        "romaji": "hashitta"
      },
      "nai": {
        "kanji": "走らない",
        "kana": "はしらない",
        "romaji": "hashiranai"
      },
      "potential": {
        "kanji": "走れる",
        "kana": "はしれる",
        "romaji": "hashireru"
      },
      "volitional": {
        "kanji": "走ろう",
        "kana": "はしろう",
        "romaji": "hashirou"
      },
      "imperative": {
        "kanji": "走れ",
        "kana": "はしれ",
        "romaji": "hashire"
      },
      "prohibitive": {
        "kanji": "走るな",
        "kana": "はしるな",
        "romaji": "hashiruna"
      },
      "passive": {
        "kanji": "走られる",
        "kana": "はしられる",
        "romaji": "hashirareru"
      },
      "causative": {
        "kanji": "走らせる",
        "kana": "はしらせる",
        "romaji": "hashiraseru"
      },
      "causativePassive": {
        "kanji": "走らされる",
        "kana": "はしらされる",
        "romaji": "hashirasareru"
      },
      "ba": {
        "kanji": "走れば",
        "kana": "はしれば",
        "romaji": "hashireba"
      }
    }
  },
  {
    "id": "kaeru",
    "kanji": "帰る",
    "kana": "かえる",
    "romaji": "kaeru",
    "english": "to return home",
    "indonesian": "pulang",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "exception-ru",
    "conjugations": {
      "dictionary": {
        "kanji": "帰る",
        "kana": "かえる",
        "romaji": "kaeru"
      },
      "masu": {
        "kanji": "帰ります",
        "kana": "かえります",
        "romaji": "kaerimasu"
      },
      "te": {
        "kanji": "帰って",
        "kana": "かえって",
        "romaji": "kaette"
      },
      "ta": {
        "kanji": "帰った",
        "kana": "かえった",
        "romaji": "kaetta"
      },
      "nai": {
        "kanji": "帰らない",
        "kana": "かえらない",
        "romaji": "kaeranai"
      },
      "potential": {
        "kanji": "帰れる",
        "kana": "かえれる",
        "romaji": "kaereru"
      },
      "volitional": {
        "kanji": "帰ろう",
        "kana": "かえろう",
        "romaji": "kaerou"
      },
      "imperative": {
        "kanji": "帰れ",
        "kana": "かえれ",
        "romaji": "kaere"
      },
      "prohibitive": {
        "kanji": "帰るな",
        "kana": "かえるな",
        "romaji": "kaeruna"
      },
      "passive": {
        "kanji": "帰られる",
        "kana": "かえられる",
        "romaji": "kaerareru"
      },
      "causative": {
        "kanji": "帰らせる",
        "kana": "かえらせる",
        "romaji": "kaeraseru"
      },
      "causativePassive": {
        "kanji": "帰らされる",
        "kana": "かえらされる",
        "romaji": "kaerasareru"
      },
      "ba": {
        "kanji": "帰れば",
        "kana": "かえれば",
        "romaji": "kaereba"
      }
    }
  },
  {
    "id": "kiru",
    "kanji": "切る",
    "kana": "きる",
    "romaji": "kiru",
    "english": "to cut",
    "indonesian": "memotong",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "exception-ru",
    "conjugations": {
      "dictionary": {
        "kanji": "切る",
        "kana": "きる",
        "romaji": "kiru"
      },
      "masu": {
        "kanji": "切ります",
        "kana": "きります",
        "romaji": "kirimasu"
      },
      "te": {
        "kanji": "切って",
        "kana": "きって",
        "romaji": "kitte"
      },
      "ta": {
        "kanji": "切った",
        "kana": "きった",
        "romaji": "kitta"
      },
      "nai": {
        "kanji": "切らない",
        "kana": "きらない",
        "romaji": "kiranai"
      },
      "potential": {
        "kanji": "切れる",
        "kana": "きれる",
        "romaji": "kireru"
      },
      "volitional": {
        "kanji": "切ろう",
        "kana": "きろう",
        "romaji": "kirou"
      },
      "imperative": {
        "kanji": "切れ",
        "kana": "きれ",
        "romaji": "kire"
      },
      "prohibitive": {
        "kanji": "切るな",
        "kana": "きるな",
        "romaji": "kiruna"
      },
      "passive": {
        "kanji": "切られる",
        "kana": "きられる",
        "romaji": "kirareru"
      },
      "causative": {
        "kanji": "切らせる",
        "kana": "きらせる",
        "romaji": "kiraseru"
      },
      "causativePassive": {
        "kanji": "切らされる",
        "kana": "きらされる",
        "romaji": "kirasareru"
      },
      "ba": {
        "kanji": "切れば",
        "kana": "きれば",
        "romaji": "kireba"
      }
    }
  },
  {
    "id": "aru",
    "kanji": "ある",
    "kana": "ある",
    "romaji": "aru",
    "english": "to exist (inanimate)",
    "indonesian": "ada (benda mati)",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "ある",
        "kana": "ある",
        "romaji": "aru"
      },
      "masu": {
        "kanji": "あります",
        "kana": "あります",
        "romaji": "arimasu"
      },
      "te": {
        "kanji": "あって",
        "kana": "あって",
        "romaji": "atte"
      },
      "ta": {
        "kanji": "あった",
        "kana": "あった",
        "romaji": "atta"
      },
      "nai": {
        "kanji": "ない",
        "kana": "ない",
        "romaji": "nai"
      },
      "potential": {
        "kanji": "あれる",
        "kana": "あれる",
        "romaji": "areru"
      },
      "volitional": {
        "kanji": "あろう",
        "kana": "あろう",
        "romaji": "arou"
      },
      "imperative": {
        "kanji": "あれ",
        "kana": "あれ",
        "romaji": "are"
      },
      "prohibitive": {
        "kanji": "あるな",
        "kana": "あるな",
        "romaji": "aruna"
      },
      "passive": {
        "kanji": "あられる",
        "kana": "あられる",
        "romaji": "arareru"
      },
      "causative": {
        "kanji": "あらせる",
        "kana": "あらせる",
        "romaji": "araseru"
      },
      "causativePassive": {
        "kanji": "あらされる",
        "kana": "あらされる",
        "romaji": "arasareru"
      },
      "ba": {
        "kanji": "あれば",
        "kana": "あれば",
        "romaji": "areba"
      }
    }
  },
  {
    "id": "iru_need",
    "kanji": "要る",
    "kana": "いる",
    "romaji": "iru",
    "english": "to need",
    "indonesian": "memerlukan",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "exception-ru",
    "conjugations": {
      "dictionary": {
        "kanji": "要る",
        "kana": "いる",
        "romaji": "iru"
      },
      "masu": {
        "kanji": "要ります",
        "kana": "いります",
        "romaji": "irimasu"
      },
      "te": {
        "kanji": "要って",
        "kana": "いって",
        "romaji": "itte"
      },
      "ta": {
        "kanji": "要った",
        "kana": "いった",
        "romaji": "itta"
      },
      "nai": {
        "kanji": "要らない",
        "kana": "いらない",
        "romaji": "iranai"
      },
      "potential": {
        "kanji": "要れる",
        "kana": "いれる",
        "romaji": "ireru"
      },
      "volitional": {
        "kanji": "要ろう",
        "kana": "いろう",
        "romaji": "irou"
      },
      "imperative": {
        "kanji": "要れ",
        "kana": "いれ",
        "romaji": "ire"
      },
      "prohibitive": {
        "kanji": "要るな",
        "kana": "いるな",
        "romaji": "iruna"
      },
      "passive": {
        "kanji": "要られる",
        "kana": "いられる",
        "romaji": "irareru"
      },
      "causative": {
        "kanji": "要らせる",
        "kana": "いらせる",
        "romaji": "iraseru"
      },
      "causativePassive": {
        "kanji": "要らされる",
        "kana": "いらされる",
        "romaji": "irasareru"
      },
      "ba": {
        "kanji": "要れば",
        "kana": "いれば",
        "romaji": "ireba"
      }
    }
  },
  {
    "id": "hairu",
    "kanji": "入る",
    "kana": "はいる",
    "romaji": "hairu",
    "english": "to enter",
    "indonesian": "masuk",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "exception-ru",
    "conjugations": {
      "dictionary": {
        "kanji": "入る",
        "kana": "はいる",
        "romaji": "hairu"
      },
      "masu": {
        "kanji": "入ります",
        "kana": "はいります",
        "romaji": "hairimasu"
      },
      "te": {
        "kanji": "入って",
        "kana": "はいって",
        "romaji": "haitte"
      },
      "ta": {
        "kanji": "入った",
        "kana": "はいった",
        "romaji": "haitta"
      },
      "nai": {
        "kanji": "入らない",
        "kana": "はいらない",
        "romaji": "hairanai"
      },
      "potential": {
        "kanji": "入れる",
        "kana": "はいれる",
        "romaji": "haireru"
      },
      "volitional": {
        "kanji": "入ろう",
        "kana": "はいろう",
        "romaji": "hairou"
      },
      "imperative": {
        "kanji": "入れ",
        "kana": "はいれ",
        "romaji": "haire"
      },
      "prohibitive": {
        "kanji": "入るな",
        "kana": "はいるな",
        "romaji": "hairuna"
      },
      "passive": {
        "kanji": "入られる",
        "kana": "はいられる",
        "romaji": "hairareru"
      },
      "causative": {
        "kanji": "入らせる",
        "kana": "はいらせる",
        "romaji": "hairaseru"
      },
      "causativePassive": {
        "kanji": "入らされる",
        "kana": "はいらされる",
        "romaji": "hairasareru"
      },
      "ba": {
        "kanji": "入れば",
        "kana": "はいれば",
        "romaji": "haireba"
      }
    }
  },
  {
    "id": "okuru",
    "kanji": "送る",
    "kana": "おくる",
    "romaji": "okuru",
    "english": "to send",
    "indonesian": "mengirim",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "送る",
        "kana": "おくる",
        "romaji": "okuru"
      },
      "masu": {
        "kanji": "送ります",
        "kana": "おくります",
        "romaji": "okurimasu"
      },
      "te": {
        "kanji": "送って",
        "kana": "おくって",
        "romaji": "okutte"
      },
      "ta": {
        "kanji": "送った",
        "kana": "おくった",
        "romaji": "okutta"
      },
      "nai": {
        "kanji": "送らない",
        "kana": "おくらない",
        "romaji": "okuranai"
      },
      "potential": {
        "kanji": "送れる",
        "kana": "おくれる",
        "romaji": "okureru"
      },
      "volitional": {
        "kanji": "送ろう",
        "kana": "おくろう",
        "romaji": "okurou"
      },
      "imperative": {
        "kanji": "送れ",
        "kana": "おくれ",
        "romaji": "okure"
      },
      "prohibitive": {
        "kanji": "送るな",
        "kana": "おくるな",
        "romaji": "okuruna"
      },
      "passive": {
        "kanji": "送られる",
        "kana": "おくられる",
        "romaji": "okurareru"
      },
      "causative": {
        "kanji": "送らせる",
        "kana": "おくらせる",
        "romaji": "okuraseru"
      },
      "causativePassive": {
        "kanji": "送らされる",
        "kana": "おくらされる",
        "romaji": "okurasareru"
      },
      "ba": {
        "kanji": "送れば",
        "kana": "おくれば",
        "romaji": "okureba"
      }
    }
  },
  {
    "id": "odoru",
    "kanji": "踊る",
    "kana": "おどる",
    "romaji": "odoru",
    "english": "to dance",
    "indonesian": "menari",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "踊る",
        "kana": "おどる",
        "romaji": "odoru"
      },
      "masu": {
        "kanji": "踊ります",
        "kana": "おどります",
        "romaji": "odorimasu"
      },
      "te": {
        "kanji": "踊って",
        "kana": "おどって",
        "romaji": "odotte"
      },
      "ta": {
        "kanji": "踊った",
        "kana": "おどった",
        "romaji": "odotta"
      },
      "nai": {
        "kanji": "踊らない",
        "kana": "おどらない",
        "romaji": "odoranai"
      },
      "potential": {
        "kanji": "踊れる",
        "kana": "おどれる",
        "romaji": "odoreru"
      },
      "volitional": {
        "kanji": "踊ろう",
        "kana": "おどろう",
        "romaji": "odorou"
      },
      "imperative": {
        "kanji": "踊れ",
        "kana": "おどれ",
        "romaji": "odore"
      },
      "prohibitive": {
        "kanji": "踊るな",
        "kana": "おどるな",
        "romaji": "odoruna"
      },
      "passive": {
        "kanji": "踊られる",
        "kana": "おどられる",
        "romaji": "odorareru"
      },
      "causative": {
        "kanji": "踊らせる",
        "kana": "おどらせる",
        "romaji": "odoraseru"
      },
      "causativePassive": {
        "kanji": "踊らされる",
        "kana": "おどらされる",
        "romaji": "odorasareru"
      },
      "ba": {
        "kanji": "踊れば",
        "kana": "おどれば",
        "romaji": "odoreba"
      }
    }
  },
  {
    "id": "oru",
    "kanji": "折る",
    "kana": "おる",
    "romaji": "oru",
    "english": "to fold / break",
    "indonesian": "melipat",
    "jlpt": "N3",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "折る",
        "kana": "おる",
        "romaji": "oru"
      },
      "masu": {
        "kanji": "折ります",
        "kana": "おります",
        "romaji": "orimasu"
      },
      "te": {
        "kanji": "折って",
        "kana": "おって",
        "romaji": "otte"
      },
      "ta": {
        "kanji": "折った",
        "kana": "おった",
        "romaji": "otta"
      },
      "nai": {
        "kanji": "折らない",
        "kana": "おらない",
        "romaji": "oranai"
      },
      "potential": {
        "kanji": "折れる",
        "kana": "おれる",
        "romaji": "oreru"
      },
      "volitional": {
        "kanji": "折ろう",
        "kana": "おろう",
        "romaji": "orou"
      },
      "imperative": {
        "kanji": "折れ",
        "kana": "おれ",
        "romaji": "ore"
      },
      "prohibitive": {
        "kanji": "折るな",
        "kana": "おるな",
        "romaji": "oruna"
      },
      "passive": {
        "kanji": "折られる",
        "kana": "おられる",
        "romaji": "orareru"
      },
      "causative": {
        "kanji": "折らせる",
        "kana": "おらせる",
        "romaji": "oraseru"
      },
      "causativePassive": {
        "kanji": "折らされる",
        "kana": "おらされる",
        "romaji": "orasareru"
      },
      "ba": {
        "kanji": "折れば",
        "kana": "おれば",
        "romaji": "oreba"
      }
    }
  },
  {
    "id": "kakaru",
    "kanji": "掛かる",
    "kana": "かかる",
    "romaji": "kakaru",
    "english": "to take (time/money)",
    "indonesian": "memakan waktu/biaya",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "掛かる",
        "kana": "かかる",
        "romaji": "kakaru"
      },
      "masu": {
        "kanji": "掛かります",
        "kana": "かかります",
        "romaji": "kakarimasu"
      },
      "te": {
        "kanji": "掛かって",
        "kana": "かかって",
        "romaji": "kakatte"
      },
      "ta": {
        "kanji": "掛かった",
        "kana": "かかった",
        "romaji": "kakatta"
      },
      "nai": {
        "kanji": "掛からない",
        "kana": "かからない",
        "romaji": "kakaranai"
      },
      "potential": {
        "kanji": "掛かれる",
        "kana": "かかれる",
        "romaji": "kakareru"
      },
      "volitional": {
        "kanji": "掛かろう",
        "kana": "かかろう",
        "romaji": "kakarou"
      },
      "imperative": {
        "kanji": "掛かれ",
        "kana": "かかれ",
        "romaji": "kakare"
      },
      "prohibitive": {
        "kanji": "掛かるな",
        "kana": "かかるな",
        "romaji": "kakaruna"
      },
      "passive": {
        "kanji": "掛かられる",
        "kana": "かかられる",
        "romaji": "kakarareru"
      },
      "causative": {
        "kanji": "掛からせる",
        "kana": "かからせる",
        "romaji": "kakaraseru"
      },
      "causativePassive": {
        "kanji": "掛からされる",
        "kana": "かからされる",
        "romaji": "kakarasareru"
      },
      "ba": {
        "kanji": "掛かれば",
        "kana": "かかれば",
        "romaji": "kakareba"
      }
    }
  },
  {
    "id": "shimaru",
    "kanji": "閉まる",
    "kana": "しまる",
    "romaji": "shimaru",
    "english": "to close",
    "indonesian": "tertutup",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "閉まる",
        "kana": "しまる",
        "romaji": "shimaru"
      },
      "masu": {
        "kanji": "閉まります",
        "kana": "しまります",
        "romaji": "shimarimasu"
      },
      "te": {
        "kanji": "閉まって",
        "kana": "しまって",
        "romaji": "shimatte"
      },
      "ta": {
        "kanji": "閉まった",
        "kana": "しまった",
        "romaji": "shimatta"
      },
      "nai": {
        "kanji": "閉まらない",
        "kana": "しまらない",
        "romaji": "shimaranai"
      },
      "potential": {
        "kanji": "閉まれる",
        "kana": "しまれる",
        "romaji": "shimareru"
      },
      "volitional": {
        "kanji": "閉まろう",
        "kana": "しまろう",
        "romaji": "shimarou"
      },
      "imperative": {
        "kanji": "閉まれ",
        "kana": "しまれ",
        "romaji": "shimare"
      },
      "prohibitive": {
        "kanji": "閉まるな",
        "kana": "しまるな",
        "romaji": "shimaruna"
      },
      "passive": {
        "kanji": "閉まられる",
        "kana": "しまられる",
        "romaji": "shimarareru"
      },
      "causative": {
        "kanji": "閉まらせる",
        "kana": "しまらせる",
        "romaji": "shimaraseru"
      },
      "causativePassive": {
        "kanji": "閉まらされる",
        "kana": "しまらされる",
        "romaji": "shimarasareru"
      },
      "ba": {
        "kanji": "閉まれば",
        "kana": "しまれば",
        "romaji": "shimareba"
      }
    }
  },
  {
    "id": "tomaru",
    "kanji": "止まる",
    "kana": "とまる",
    "romaji": "tomaru",
    "english": "to stop",
    "indonesian": "berhenti",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "止まる",
        "kana": "とまる",
        "romaji": "tomaru"
      },
      "masu": {
        "kanji": "止まります",
        "kana": "とまります",
        "romaji": "tomarimasu"
      },
      "te": {
        "kanji": "止まって",
        "kana": "とまって",
        "romaji": "tomatte"
      },
      "ta": {
        "kanji": "止まった",
        "kana": "とまった",
        "romaji": "tomatta"
      },
      "nai": {
        "kanji": "止まらない",
        "kana": "とまらない",
        "romaji": "tomaranai"
      },
      "potential": {
        "kanji": "止まれる",
        "kana": "とまれる",
        "romaji": "tomareru"
      },
      "volitional": {
        "kanji": "止まろう",
        "kana": "とまろう",
        "romaji": "tomarou"
      },
      "imperative": {
        "kanji": "止まれ",
        "kana": "とまれ",
        "romaji": "tomare"
      },
      "prohibitive": {
        "kanji": "止まるな",
        "kana": "とまるな",
        "romaji": "tomaruna"
      },
      "passive": {
        "kanji": "止まられる",
        "kana": "とまられる",
        "romaji": "tomarareru"
      },
      "causative": {
        "kanji": "止まらせる",
        "kana": "とまらせる",
        "romaji": "tomaraseru"
      },
      "causativePassive": {
        "kanji": "止まらされる",
        "kana": "とまらされる",
        "romaji": "tomarasareru"
      },
      "ba": {
        "kanji": "止まれば",
        "kana": "とまれば",
        "romaji": "tomareba"
      }
    }
  },
  {
    "id": "hazimaru",
    "kanji": "始まる",
    "kana": "はじまる",
    "romaji": "hazimaru",
    "english": "to begin",
    "indonesian": "mulai / dimulai",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "始まる",
        "kana": "はじまる",
        "romaji": "hazimaru"
      },
      "masu": {
        "kanji": "始まります",
        "kana": "はじまります",
        "romaji": "hazimarimasu"
      },
      "te": {
        "kanji": "始まって",
        "kana": "はじまって",
        "romaji": "hazimatte"
      },
      "ta": {
        "kanji": "始まった",
        "kana": "はじまった",
        "romaji": "hazimatta"
      },
      "nai": {
        "kanji": "始まらない",
        "kana": "はじまらない",
        "romaji": "hazimaranai"
      },
      "potential": {
        "kanji": "始まれる",
        "kana": "はじまれる",
        "romaji": "hazimareru"
      },
      "volitional": {
        "kanji": "始まろう",
        "kana": "はじまろう",
        "romaji": "hazimarou"
      },
      "imperative": {
        "kanji": "始まれ",
        "kana": "はじまれ",
        "romaji": "hazimare"
      },
      "prohibitive": {
        "kanji": "始まるな",
        "kana": "はじまるな",
        "romaji": "hazimaruna"
      },
      "passive": {
        "kanji": "始まられる",
        "kana": "はじまられる",
        "romaji": "hazimarareru"
      },
      "causative": {
        "kanji": "始まらせる",
        "kana": "はじまらせる",
        "romaji": "hazimaraseru"
      },
      "causativePassive": {
        "kanji": "始まらされる",
        "kana": "はじまらされる",
        "romaji": "hazimarasareru"
      },
      "ba": {
        "kanji": "始まれば",
        "kana": "はじまれば",
        "romaji": "hazimareba"
      }
    }
  },
  {
    "id": "naru",
    "kanji": "なる",
    "kana": "なる",
    "romaji": "naru",
    "english": "to become",
    "indonesian": "menjadi",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "なる",
        "kana": "なる",
        "romaji": "naru"
      },
      "masu": {
        "kanji": "なります",
        "kana": "なります",
        "romaji": "narimasu"
      },
      "te": {
        "kanji": "なって",
        "kana": "なって",
        "romaji": "natte"
      },
      "ta": {
        "kanji": "なった",
        "kana": "なった",
        "romaji": "natta"
      },
      "nai": {
        "kanji": "ならない",
        "kana": "ならない",
        "romaji": "naranai"
      },
      "potential": {
        "kanji": "なれる",
        "kana": "なれる",
        "romaji": "nareru"
      },
      "volitional": {
        "kanji": "なろう",
        "kana": "なろう",
        "romaji": "narou"
      },
      "imperative": {
        "kanji": "なれ",
        "kana": "なれ",
        "romaji": "nare"
      },
      "prohibitive": {
        "kanji": "なるな",
        "kana": "なるな",
        "romaji": "naruna"
      },
      "passive": {
        "kanji": "なられる",
        "kana": "なられる",
        "romaji": "narareru"
      },
      "causative": {
        "kanji": "ならせる",
        "kana": "ならせる",
        "romaji": "naraseru"
      },
      "causativePassive": {
        "kanji": "ならされる",
        "kana": "ならされる",
        "romaji": "narasareru"
      },
      "ba": {
        "kanji": "なれば",
        "kana": "なれば",
        "romaji": "nareba"
      }
    }
  },
  {
    "id": "yaru",
    "kanji": "やる",
    "kana": "やる",
    "romaji": "yaru",
    "english": "to do / give",
    "indonesian": "melakukan / memberi",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "やる",
        "kana": "やる",
        "romaji": "yaru"
      },
      "masu": {
        "kanji": "やります",
        "kana": "やります",
        "romaji": "yarimasu"
      },
      "te": {
        "kanji": "やって",
        "kana": "やって",
        "romaji": "yatte"
      },
      "ta": {
        "kanji": "やった",
        "kana": "やった",
        "romaji": "yatta"
      },
      "nai": {
        "kanji": "やらない",
        "kana": "やらない",
        "romaji": "yaranai"
      },
      "potential": {
        "kanji": "やれる",
        "kana": "やれる",
        "romaji": "yareru"
      },
      "volitional": {
        "kanji": "やろう",
        "kana": "やろう",
        "romaji": "yarou"
      },
      "imperative": {
        "kanji": "やれ",
        "kana": "やれ",
        "romaji": "yare"
      },
      "prohibitive": {
        "kanji": "やるな",
        "kana": "やるな",
        "romaji": "yaruna"
      },
      "passive": {
        "kanji": "やられる",
        "kana": "やられる",
        "romaji": "yarareru"
      },
      "causative": {
        "kanji": "やらせる",
        "kana": "やらせる",
        "romaji": "yaraseru"
      },
      "causativePassive": {
        "kanji": "やらされる",
        "kana": "やらされる",
        "romaji": "yarasareru"
      },
      "ba": {
        "kanji": "やれば",
        "kana": "やれば",
        "romaji": "yareba"
      }
    }
  },
  {
    "id": "tsukuru_2",
    "kanji": "造る",
    "kana": "つくる",
    "romaji": "tsukuru",
    "english": "to manufacture / build",
    "indonesian": "membuat / memproduksi",
    "jlpt": "N3",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "造る",
        "kana": "つくる",
        "romaji": "tsukuru"
      },
      "masu": {
        "kanji": "造ります",
        "kana": "つくります",
        "romaji": "tsukurimasu"
      },
      "te": {
        "kanji": "造って",
        "kana": "つくって",
        "romaji": "tsukutte"
      },
      "ta": {
        "kanji": "造った",
        "kana": "つくった",
        "romaji": "tsukutta"
      },
      "nai": {
        "kanji": "造らない",
        "kana": "つくらない",
        "romaji": "tsukuranai"
      },
      "potential": {
        "kanji": "造れる",
        "kana": "つくれる",
        "romaji": "tsukureru"
      },
      "volitional": {
        "kanji": "造ろう",
        "kana": "つくろう",
        "romaji": "tsukurou"
      },
      "imperative": {
        "kanji": "造れ",
        "kana": "つくれ",
        "romaji": "tsukure"
      },
      "prohibitive": {
        "kanji": "造るな",
        "kana": "つくるな",
        "romaji": "tsukuruna"
      },
      "passive": {
        "kanji": "造られる",
        "kana": "つくられる",
        "romaji": "tsukurareru"
      },
      "causative": {
        "kanji": "造らせる",
        "kana": "つくらせる",
        "romaji": "tsukuraseru"
      },
      "causativePassive": {
        "kanji": "造らされる",
        "kana": "つくらされる",
        "romaji": "tsukurasareru"
      },
      "ba": {
        "kanji": "造れば",
        "kana": "つくれば",
        "romaji": "tsukureba"
      }
    }
  },
  {
    "id": "mamoru",
    "kanji": "守る",
    "kana": "まもる",
    "romaji": "mamoru",
    "english": "to protect / keep promise",
    "indonesian": "melindungi / menaati",
    "jlpt": "N3",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "守る",
        "kana": "まもる",
        "romaji": "mamoru"
      },
      "masu": {
        "kanji": "守ります",
        "kana": "まもります",
        "romaji": "mamorimasu"
      },
      "te": {
        "kanji": "守って",
        "kana": "まもって",
        "romaji": "mamotte"
      },
      "ta": {
        "kanji": "守った",
        "kana": "まもった",
        "romaji": "mamotta"
      },
      "nai": {
        "kanji": "守らない",
        "kana": "まもらない",
        "romaji": "mamoranai"
      },
      "potential": {
        "kanji": "守れる",
        "kana": "まもれる",
        "romaji": "mamoreru"
      },
      "volitional": {
        "kanji": "守ろう",
        "kana": "まもろう",
        "romaji": "mamorou"
      },
      "imperative": {
        "kanji": "守れ",
        "kana": "まもれ",
        "romaji": "mamore"
      },
      "prohibitive": {
        "kanji": "守るな",
        "kana": "まもるな",
        "romaji": "mamoruna"
      },
      "passive": {
        "kanji": "守られる",
        "kana": "まもられる",
        "romaji": "mamorareru"
      },
      "causative": {
        "kanji": "守らせる",
        "kana": "まもらせる",
        "romaji": "mamoraseru"
      },
      "causativePassive": {
        "kanji": "守らされる",
        "kana": "まもらされる",
        "romaji": "mamorasareru"
      },
      "ba": {
        "kanji": "守れば",
        "kana": "まもれば",
        "romaji": "mamoreba"
      }
    }
  },
  {
    "id": "inoru",
    "kanji": "祈る",
    "kana": "いのる",
    "romaji": "inoru",
    "english": "to pray",
    "indonesian": "berdoa",
    "jlpt": "N3",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "祈る",
        "kana": "いのる",
        "romaji": "inoru"
      },
      "masu": {
        "kanji": "祈ります",
        "kana": "いのります",
        "romaji": "inorimasu"
      },
      "te": {
        "kanji": "祈って",
        "kana": "いのって",
        "romaji": "inotte"
      },
      "ta": {
        "kanji": "祈った",
        "kana": "いのった",
        "romaji": "inotta"
      },
      "nai": {
        "kanji": "祈らない",
        "kana": "いのらない",
        "romaji": "inoranai"
      },
      "potential": {
        "kanji": "祈れる",
        "kana": "いのれる",
        "romaji": "inoreru"
      },
      "volitional": {
        "kanji": "祈ろう",
        "kana": "いのろう",
        "romaji": "inorou"
      },
      "imperative": {
        "kanji": "祈れ",
        "kana": "いのれ",
        "romaji": "inore"
      },
      "prohibitive": {
        "kanji": "祈るな",
        "kana": "いのるな",
        "romaji": "inoruna"
      },
      "passive": {
        "kanji": "祈られる",
        "kana": "いのられる",
        "romaji": "inorareru"
      },
      "causative": {
        "kanji": "祈らせる",
        "kana": "いのらせる",
        "romaji": "inoraseru"
      },
      "causativePassive": {
        "kanji": "祈らされる",
        "kana": "いのらされる",
        "romaji": "inorasareru"
      },
      "ba": {
        "kanji": "祈れば",
        "kana": "いのれば",
        "romaji": "inoreba"
      }
    }
  },
  {
    "id": "ataru",
    "kanji": "当たる",
    "kana": "あたる",
    "romaji": "ataru",
    "english": "to hit / strike / win",
    "indonesian": "mengenai / menang (undian)",
    "jlpt": "N3",
    "group": 1,
    "subGroup": "ru",
    "conjugations": {
      "dictionary": {
        "kanji": "当たる",
        "kana": "あたる",
        "romaji": "ataru"
      },
      "masu": {
        "kanji": "当たります",
        "kana": "あたります",
        "romaji": "atarimasu"
      },
      "te": {
        "kanji": "当たって",
        "kana": "あたって",
        "romaji": "atatte"
      },
      "ta": {
        "kanji": "当たった",
        "kana": "あたった",
        "romaji": "atatta"
      },
      "nai": {
        "kanji": "当たらない",
        "kana": "あたらない",
        "romaji": "ataranai"
      },
      "potential": {
        "kanji": "当たれる",
        "kana": "あたれる",
        "romaji": "atareru"
      },
      "volitional": {
        "kanji": "当たろう",
        "kana": "あたろう",
        "romaji": "atarou"
      },
      "imperative": {
        "kanji": "当たれ",
        "kana": "あたれ",
        "romaji": "atare"
      },
      "prohibitive": {
        "kanji": "当たるな",
        "kana": "あたるな",
        "romaji": "ataruna"
      },
      "passive": {
        "kanji": "当たられる",
        "kana": "あたられる",
        "romaji": "atarareru"
      },
      "causative": {
        "kanji": "当たらせる",
        "kana": "あたらせる",
        "romaji": "ataraseru"
      },
      "causativePassive": {
        "kanji": "当たらされる",
        "kana": "あたらされる",
        "romaji": "atarasareru"
      },
      "ba": {
        "kanji": "当たれば",
        "kana": "あたれば",
        "romaji": "atareba"
      }
    }
  },
  {
    "id": "nomu",
    "kanji": "飲む",
    "kana": "のむ",
    "romaji": "nomu",
    "english": "to drink",
    "indonesian": "minum",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "mu",
    "conjugations": {
      "dictionary": {
        "kanji": "飲む",
        "kana": "のむ",
        "romaji": "nomu"
      },
      "masu": {
        "kanji": "飲みます",
        "kana": "のみます",
        "romaji": "nomimasu"
      },
      "te": {
        "kanji": "飲んで",
        "kana": "のんで",
        "romaji": "nonde"
      },
      "ta": {
        "kanji": "飲んだ",
        "kana": "のんだ",
        "romaji": "nonda"
      },
      "nai": {
        "kanji": "飲まない",
        "kana": "のまない",
        "romaji": "nomanai"
      },
      "potential": {
        "kanji": "飲める",
        "kana": "のめる",
        "romaji": "nomeru"
      },
      "volitional": {
        "kanji": "飲もう",
        "kana": "のもう",
        "romaji": "nomou"
      },
      "imperative": {
        "kanji": "飲め",
        "kana": "のめ",
        "romaji": "nome"
      },
      "prohibitive": {
        "kanji": "飲むな",
        "kana": "のむな",
        "romaji": "nomuna"
      },
      "passive": {
        "kanji": "飲まれる",
        "kana": "のまれる",
        "romaji": "nomareru"
      },
      "causative": {
        "kanji": "飲ませる",
        "kana": "のませる",
        "romaji": "nomaseru"
      },
      "causativePassive": {
        "kanji": "飲まされる",
        "kana": "のまされる",
        "romaji": "nomasareru"
      },
      "ba": {
        "kanji": "飲めば",
        "kana": "のめば",
        "romaji": "nomeba"
      }
    }
  },
  {
    "id": "yomu",
    "kanji": "読む",
    "kana": "よむ",
    "romaji": "yomu",
    "english": "to read",
    "indonesian": "membaca",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "mu",
    "conjugations": {
      "dictionary": {
        "kanji": "読む",
        "kana": "よむ",
        "romaji": "yomu"
      },
      "masu": {
        "kanji": "読みます",
        "kana": "よみます",
        "romaji": "yomimasu"
      },
      "te": {
        "kanji": "読んで",
        "kana": "よんで",
        "romaji": "yonde"
      },
      "ta": {
        "kanji": "読んだ",
        "kana": "よんだ",
        "romaji": "yonda"
      },
      "nai": {
        "kanji": "読まない",
        "kana": "よまない",
        "romaji": "yomanai"
      },
      "potential": {
        "kanji": "読める",
        "kana": "よめる",
        "romaji": "yomeru"
      },
      "volitional": {
        "kanji": "読もう",
        "kana": "よもう",
        "romaji": "yomou"
      },
      "imperative": {
        "kanji": "読め",
        "kana": "よめ",
        "romaji": "yome"
      },
      "prohibitive": {
        "kanji": "読むな",
        "kana": "よむな",
        "romaji": "yomuna"
      },
      "passive": {
        "kanji": "読まれる",
        "kana": "よまれる",
        "romaji": "yomareru"
      },
      "causative": {
        "kanji": "読ませる",
        "kana": "よませる",
        "romaji": "yomaseru"
      },
      "causativePassive": {
        "kanji": "読まされる",
        "kana": "よまされる",
        "romaji": "yomasareru"
      },
      "ba": {
        "kanji": "読めば",
        "kana": "よめば",
        "romaji": "yomeba"
      }
    }
  },
  {
    "id": "sumu",
    "kanji": "住む",
    "kana": "すむ",
    "romaji": "sumu",
    "english": "to reside / live",
    "indonesian": "tinggal / menetap",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "mu",
    "conjugations": {
      "dictionary": {
        "kanji": "住む",
        "kana": "すむ",
        "romaji": "sumu"
      },
      "masu": {
        "kanji": "住みます",
        "kana": "すみます",
        "romaji": "sumimasu"
      },
      "te": {
        "kanji": "住んで",
        "kana": "すんで",
        "romaji": "sunde"
      },
      "ta": {
        "kanji": "住んだ",
        "kana": "すんだ",
        "romaji": "sunda"
      },
      "nai": {
        "kanji": "住まない",
        "kana": "すまない",
        "romaji": "sumanai"
      },
      "potential": {
        "kanji": "住める",
        "kana": "すめる",
        "romaji": "sumeru"
      },
      "volitional": {
        "kanji": "住もう",
        "kana": "すもう",
        "romaji": "sumou"
      },
      "imperative": {
        "kanji": "住め",
        "kana": "すめ",
        "romaji": "sume"
      },
      "prohibitive": {
        "kanji": "住むな",
        "kana": "すむな",
        "romaji": "sumuna"
      },
      "passive": {
        "kanji": "住まれる",
        "kana": "すまれる",
        "romaji": "sumareru"
      },
      "causative": {
        "kanji": "住ませる",
        "kana": "すませる",
        "romaji": "sumaseru"
      },
      "causativePassive": {
        "kanji": "住まされる",
        "kana": "すまされる",
        "romaji": "sumasareru"
      },
      "ba": {
        "kanji": "住めば",
        "kana": "すめば",
        "romaji": "sumeba"
      }
    }
  },
  {
    "id": "yasumu",
    "kanji": "休む",
    "kana": "やすむ",
    "romaji": "yasumu",
    "english": "to rest / take a holiday",
    "indonesian": "istirahat / libur",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "mu",
    "conjugations": {
      "dictionary": {
        "kanji": "休む",
        "kana": "やすむ",
        "romaji": "yasumu"
      },
      "masu": {
        "kanji": "休みます",
        "kana": "やすみます",
        "romaji": "yasumimasu"
      },
      "te": {
        "kanji": "休んで",
        "kana": "やすんで",
        "romaji": "yasunde"
      },
      "ta": {
        "kanji": "休んだ",
        "kana": "やすんだ",
        "romaji": "yasunda"
      },
      "nai": {
        "kanji": "休まない",
        "kana": "やすまない",
        "romaji": "yasumanai"
      },
      "potential": {
        "kanji": "休める",
        "kana": "やすめる",
        "romaji": "yasumeru"
      },
      "volitional": {
        "kanji": "休もう",
        "kana": "やすもう",
        "romaji": "yasumou"
      },
      "imperative": {
        "kanji": "休め",
        "kana": "やすめ",
        "romaji": "yasume"
      },
      "prohibitive": {
        "kanji": "休むな",
        "kana": "やすむな",
        "romaji": "yasumuna"
      },
      "passive": {
        "kanji": "休まれる",
        "kana": "やすまれる",
        "romaji": "yasumareru"
      },
      "causative": {
        "kanji": "休ませる",
        "kana": "やすませる",
        "romaji": "yasumaseru"
      },
      "causativePassive": {
        "kanji": "休まされる",
        "kana": "やすまされる",
        "romaji": "yasumasareru"
      },
      "ba": {
        "kanji": "休めば",
        "kana": "やすめば",
        "romaji": "yasumeba"
      }
    }
  },
  {
    "id": "tanomu",
    "kanji": "頼む",
    "kana": "たのむ",
    "romaji": "tanomu",
    "english": "to request / order",
    "indonesian": "meminta bantuan / memesan",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "mu",
    "conjugations": {
      "dictionary": {
        "kanji": "頼む",
        "kana": "たのむ",
        "romaji": "tanomu"
      },
      "masu": {
        "kanji": "頼みます",
        "kana": "たのみます",
        "romaji": "tanomimasu"
      },
      "te": {
        "kanji": "頼んで",
        "kana": "たのんで",
        "romaji": "tanonde"
      },
      "ta": {
        "kanji": "頼んだ",
        "kana": "たのんだ",
        "romaji": "tanonda"
      },
      "nai": {
        "kanji": "頼まない",
        "kana": "たのまない",
        "romaji": "tanomanai"
      },
      "potential": {
        "kanji": "頼める",
        "kana": "たのめる",
        "romaji": "tanomeru"
      },
      "volitional": {
        "kanji": "頼もう",
        "kana": "たのもう",
        "romaji": "tanomou"
      },
      "imperative": {
        "kanji": "頼め",
        "kana": "たのめ",
        "romaji": "tanome"
      },
      "prohibitive": {
        "kanji": "頼むな",
        "kana": "たのむな",
        "romaji": "tanomuna"
      },
      "passive": {
        "kanji": "頼まれる",
        "kana": "たのまれる",
        "romaji": "tanomareru"
      },
      "causative": {
        "kanji": "頼ませる",
        "kana": "たのませる",
        "romaji": "tanomaseru"
      },
      "causativePassive": {
        "kanji": "頼まされる",
        "kana": "たのまされる",
        "romaji": "tanomasareru"
      },
      "ba": {
        "kanji": "頼めば",
        "kana": "たのめば",
        "romaji": "tanomeba"
      }
    }
  },
  {
    "id": "kamu",
    "kanji": "噛む",
    "kana": "かむ",
    "romaji": "kamu",
    "english": "to bite / chew",
    "indonesian": "menggigit / mengunyah",
    "jlpt": "N3",
    "group": 1,
    "subGroup": "mu",
    "conjugations": {
      "dictionary": {
        "kanji": "噛む",
        "kana": "かむ",
        "romaji": "kamu"
      },
      "masu": {
        "kanji": "噛みます",
        "kana": "かみます",
        "romaji": "kamimasu"
      },
      "te": {
        "kanji": "噛んで",
        "kana": "かんで",
        "romaji": "kande"
      },
      "ta": {
        "kanji": "噛んだ",
        "kana": "かんだ",
        "romaji": "kanda"
      },
      "nai": {
        "kanji": "噛まない",
        "kana": "かまない",
        "romaji": "kamanai"
      },
      "potential": {
        "kanji": "噛める",
        "kana": "かめる",
        "romaji": "kameru"
      },
      "volitional": {
        "kanji": "噛もう",
        "kana": "かもう",
        "romaji": "kamou"
      },
      "imperative": {
        "kanji": "噛め",
        "kana": "かめ",
        "romaji": "kame"
      },
      "prohibitive": {
        "kanji": "噛むな",
        "kana": "かむな",
        "romaji": "kamuna"
      },
      "passive": {
        "kanji": "噛まれる",
        "kana": "かまれる",
        "romaji": "kamareru"
      },
      "causative": {
        "kanji": "噛ませる",
        "kana": "かませる",
        "romaji": "kamaseru"
      },
      "causativePassive": {
        "kanji": "噛まされる",
        "kana": "かまされる",
        "romaji": "kamasareru"
      },
      "ba": {
        "kanji": "噛めば",
        "kana": "かめば",
        "romaji": "kameba"
      }
    }
  },
  {
    "id": "nusumu",
    "kanji": "盗む",
    "kana": "ぬすむ",
    "romaji": "nusumu",
    "english": "to steal",
    "indonesian": "mencuri",
    "jlpt": "N3",
    "group": 1,
    "subGroup": "mu",
    "conjugations": {
      "dictionary": {
        "kanji": "盗む",
        "kana": "ぬすむ",
        "romaji": "nusumu"
      },
      "masu": {
        "kanji": "盗みます",
        "kana": "ぬすみます",
        "romaji": "nusumimasu"
      },
      "te": {
        "kanji": "盗んで",
        "kana": "ぬすんで",
        "romaji": "nusunde"
      },
      "ta": {
        "kanji": "盗んだ",
        "kana": "ぬすんだ",
        "romaji": "nusunda"
      },
      "nai": {
        "kanji": "盗まない",
        "kana": "ぬすまない",
        "romaji": "nusumanai"
      },
      "potential": {
        "kanji": "盗める",
        "kana": "ぬすめる",
        "romaji": "nusumeru"
      },
      "volitional": {
        "kanji": "盗もう",
        "kana": "ぬすもう",
        "romaji": "nusumou"
      },
      "imperative": {
        "kanji": "盗め",
        "kana": "ぬすめ",
        "romaji": "nusume"
      },
      "prohibitive": {
        "kanji": "盗むな",
        "kana": "ぬすむな",
        "romaji": "nusumuna"
      },
      "passive": {
        "kanji": "盗まれる",
        "kana": "ぬすまれる",
        "romaji": "nusumareru"
      },
      "causative": {
        "kanji": "盗ませる",
        "kana": "ぬすませる",
        "romaji": "nusumaseru"
      },
      "causativePassive": {
        "kanji": "盗まされる",
        "kana": "ぬすまされる",
        "romaji": "nusumasareru"
      },
      "ba": {
        "kanji": "盗めば",
        "kana": "ぬすめば",
        "romaji": "nusumeba"
      }
    }
  },
  {
    "id": "tsumu",
    "kanji": "積む",
    "kana": "つむ",
    "romaji": "tsumu",
    "english": "to pile up / load",
    "indonesian": "menumpuk",
    "jlpt": "N2",
    "group": 1,
    "subGroup": "mu",
    "conjugations": {
      "dictionary": {
        "kanji": "積む",
        "kana": "つむ",
        "romaji": "tsumu"
      },
      "masu": {
        "kanji": "積みます",
        "kana": "つみます",
        "romaji": "tsumimasu"
      },
      "te": {
        "kanji": "積んで",
        "kana": "つんで",
        "romaji": "tsunde"
      },
      "ta": {
        "kanji": "積んだ",
        "kana": "つんだ",
        "romaji": "tsunda"
      },
      "nai": {
        "kanji": "積まない",
        "kana": "つまない",
        "romaji": "tsumanai"
      },
      "potential": {
        "kanji": "積める",
        "kana": "つめる",
        "romaji": "tsumeru"
      },
      "volitional": {
        "kanji": "積もう",
        "kana": "つもう",
        "romaji": "tsumou"
      },
      "imperative": {
        "kanji": "積め",
        "kana": "つめ",
        "romaji": "tsume"
      },
      "prohibitive": {
        "kanji": "積むな",
        "kana": "つむな",
        "romaji": "tsumuna"
      },
      "passive": {
        "kanji": "積まれる",
        "kana": "つまれる",
        "romaji": "tsumareru"
      },
      "causative": {
        "kanji": "積ませる",
        "kana": "つませる",
        "romaji": "tsumaseru"
      },
      "causativePassive": {
        "kanji": "積まされる",
        "kana": "つまされる",
        "romaji": "tsumasareru"
      },
      "ba": {
        "kanji": "積めば",
        "kana": "つめば",
        "romaji": "tsumeba"
      }
    }
  },
  {
    "id": "yasumu_class",
    "kanji": "休む",
    "kana": "やすむ",
    "romaji": "yasumu",
    "english": "to be absent",
    "indonesian": "absen",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "mu",
    "conjugations": {
      "dictionary": {
        "kanji": "休む",
        "kana": "やすむ",
        "romaji": "yasumu"
      },
      "masu": {
        "kanji": "休みます",
        "kana": "やすみます",
        "romaji": "yasumimasu"
      },
      "te": {
        "kanji": "休んで",
        "kana": "やすんで",
        "romaji": "yasunde"
      },
      "ta": {
        "kanji": "休んだ",
        "kana": "やすんだ",
        "romaji": "yasunda"
      },
      "nai": {
        "kanji": "休まない",
        "kana": "やすまない",
        "romaji": "yasumanai"
      },
      "potential": {
        "kanji": "休める",
        "kana": "やすめる",
        "romaji": "yasumeru"
      },
      "volitional": {
        "kanji": "休もう",
        "kana": "やすもう",
        "romaji": "yasumou"
      },
      "imperative": {
        "kanji": "休め",
        "kana": "やすめ",
        "romaji": "yasume"
      },
      "prohibitive": {
        "kanji": "休むな",
        "kana": "やすむな",
        "romaji": "yasumuna"
      },
      "passive": {
        "kanji": "休まれる",
        "kana": "やすまれる",
        "romaji": "yasumareru"
      },
      "causative": {
        "kanji": "休ませる",
        "kana": "やすませる",
        "romaji": "yasumaseru"
      },
      "causativePassive": {
        "kanji": "休まされる",
        "kana": "やすまされる",
        "romaji": "yasumasareru"
      },
      "ba": {
        "kanji": "休めば",
        "kana": "やすめば",
        "romaji": "yasumeba"
      }
    }
  },
  {
    "id": "asobu",
    "kanji": "遊ぶ",
    "kana": "あそぶ",
    "romaji": "asobu",
    "english": "to play",
    "indonesian": "bermain",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "bu",
    "conjugations": {
      "dictionary": {
        "kanji": "遊ぶ",
        "kana": "あそぶ",
        "romaji": "asobu"
      },
      "masu": {
        "kanji": "遊びます",
        "kana": "あそびます",
        "romaji": "asobimasu"
      },
      "te": {
        "kanji": "遊んで",
        "kana": "あそんで",
        "romaji": "asonde"
      },
      "ta": {
        "kanji": "遊んだ",
        "kana": "あそんだ",
        "romaji": "asonda"
      },
      "nai": {
        "kanji": "遊ばない",
        "kana": "あそばない",
        "romaji": "asobanai"
      },
      "potential": {
        "kanji": "遊べる",
        "kana": "あそべる",
        "romaji": "asoberu"
      },
      "volitional": {
        "kanji": "遊ぼう",
        "kana": "あそぼう",
        "romaji": "asobou"
      },
      "imperative": {
        "kanji": "遊べ",
        "kana": "あそべ",
        "romaji": "asobe"
      },
      "prohibitive": {
        "kanji": "遊ぶな",
        "kana": "あそぶな",
        "romaji": "asobuna"
      },
      "passive": {
        "kanji": "遊ばれる",
        "kana": "あそばれる",
        "romaji": "asobareru"
      },
      "causative": {
        "kanji": "遊ばせる",
        "kana": "あそばせる",
        "romaji": "asobaseru"
      },
      "causativePassive": {
        "kanji": "遊ばされる",
        "kana": "あそばされる",
        "romaji": "asobasareru"
      },
      "ba": {
        "kanji": "遊べば",
        "kana": "あそべば",
        "romaji": "asobeba"
      }
    }
  },
  {
    "id": "yobu",
    "kanji": "呼ぶ",
    "kana": "よぶ",
    "romaji": "yobu",
    "english": "to call",
    "indonesian": "memanggil",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "bu",
    "conjugations": {
      "dictionary": {
        "kanji": "呼ぶ",
        "kana": "よぶ",
        "romaji": "yobu"
      },
      "masu": {
        "kanji": "呼びます",
        "kana": "よびます",
        "romaji": "yobimasu"
      },
      "te": {
        "kanji": "呼んで",
        "kana": "よんで",
        "romaji": "yonde"
      },
      "ta": {
        "kanji": "呼んだ",
        "kana": "よんだ",
        "romaji": "yonda"
      },
      "nai": {
        "kanji": "呼ばない",
        "kana": "よばない",
        "romaji": "yobanai"
      },
      "potential": {
        "kanji": "呼べる",
        "kana": "よべる",
        "romaji": "yoberu"
      },
      "volitional": {
        "kanji": "呼ぼう",
        "kana": "よぼう",
        "romaji": "yobou"
      },
      "imperative": {
        "kanji": "呼べ",
        "kana": "よべ",
        "romaji": "yobe"
      },
      "prohibitive": {
        "kanji": "呼ぶな",
        "kana": "よぶな",
        "romaji": "yobuna"
      },
      "passive": {
        "kanji": "呼ばれる",
        "kana": "よばれる",
        "romaji": "yobareru"
      },
      "causative": {
        "kanji": "呼ばせる",
        "kana": "よばせる",
        "romaji": "yobaseru"
      },
      "causativePassive": {
        "kanji": "呼ばされる",
        "kana": "よばされる",
        "romaji": "yobasareru"
      },
      "ba": {
        "kanji": "呼べば",
        "kana": "よべば",
        "romaji": "yobeba"
      }
    }
  },
  {
    "id": "tobu",
    "kanji": "飛ぶ",
    "kana": "とぶ",
    "romaji": "tobu",
    "english": "to fly / jump",
    "indonesian": "terbang / melompat",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "bu",
    "conjugations": {
      "dictionary": {
        "kanji": "飛ぶ",
        "kana": "とぶ",
        "romaji": "tobu"
      },
      "masu": {
        "kanji": "飛びます",
        "kana": "とびます",
        "romaji": "tobimasu"
      },
      "te": {
        "kanji": "飛んで",
        "kana": "とんで",
        "romaji": "tonde"
      },
      "ta": {
        "kanji": "飛んだ",
        "kana": "とんだ",
        "romaji": "tonda"
      },
      "nai": {
        "kanji": "飛ばない",
        "kana": "とばない",
        "romaji": "tobanai"
      },
      "potential": {
        "kanji": "飛べる",
        "kana": "とべる",
        "romaji": "toberu"
      },
      "volitional": {
        "kanji": "飛ぼう",
        "kana": "とぼう",
        "romaji": "tobou"
      },
      "imperative": {
        "kanji": "飛べ",
        "kana": "とべ",
        "romaji": "tobe"
      },
      "prohibitive": {
        "kanji": "飛ぶな",
        "kana": "とぶな",
        "romaji": "tobuna"
      },
      "passive": {
        "kanji": "飛ばれる",
        "kana": "とばれる",
        "romaji": "tobareru"
      },
      "causative": {
        "kanji": "飛ばせる",
        "kana": "とばせる",
        "romaji": "tobaseru"
      },
      "causativePassive": {
        "kanji": "飛ばされる",
        "kana": "とばされる",
        "romaji": "tobasareru"
      },
      "ba": {
        "kanji": "飛べば",
        "kana": "とべば",
        "romaji": "tobeba"
      }
    }
  },
  {
    "id": "hakobu",
    "kanji": "運ぶ",
    "kana": "はこぶ",
    "romaji": "hakobu",
    "english": "to transport / carry",
    "indonesian": "membawa / mengangkut",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "bu",
    "conjugations": {
      "dictionary": {
        "kanji": "運ぶ",
        "kana": "はこぶ",
        "romaji": "hakobu"
      },
      "masu": {
        "kanji": "運びます",
        "kana": "はこびます",
        "romaji": "hakobimasu"
      },
      "te": {
        "kanji": "運んで",
        "kana": "はこんで",
        "romaji": "hakonde"
      },
      "ta": {
        "kanji": "運んだ",
        "kana": "はこんだ",
        "romaji": "hakonda"
      },
      "nai": {
        "kanji": "運ばない",
        "kana": "はこばない",
        "romaji": "hakobanai"
      },
      "potential": {
        "kanji": "運べる",
        "kana": "はこべる",
        "romaji": "hakoberu"
      },
      "volitional": {
        "kanji": "運ぼう",
        "kana": "はこぼう",
        "romaji": "hakobou"
      },
      "imperative": {
        "kanji": "運べ",
        "kana": "はこべ",
        "romaji": "hakobe"
      },
      "prohibitive": {
        "kanji": "運ぶな",
        "kana": "はこぶな",
        "romaji": "hakobuna"
      },
      "passive": {
        "kanji": "運ばれる",
        "kana": "はこばれる",
        "romaji": "hakobareru"
      },
      "causative": {
        "kanji": "運ばせる",
        "kana": "はこばせる",
        "romaji": "hakobaseru"
      },
      "causativePassive": {
        "kanji": "運ばされる",
        "kana": "はこばされる",
        "romaji": "hakobasareru"
      },
      "ba": {
        "kanji": "運べば",
        "kana": "はこべば",
        "romaji": "hakobeba"
      }
    }
  },
  {
    "id": "erabu",
    "kanji": "選ぶ",
    "kana": "えらぶ",
    "romaji": "erabu",
    "english": "to choose",
    "indonesian": "memilih",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "bu",
    "conjugations": {
      "dictionary": {
        "kanji": "選ぶ",
        "kana": "えらぶ",
        "romaji": "erabu"
      },
      "masu": {
        "kanji": "選びます",
        "kana": "えらびます",
        "romaji": "erabimasu"
      },
      "te": {
        "kanji": "選んで",
        "kana": "えらんで",
        "romaji": "erande"
      },
      "ta": {
        "kanji": "選んだ",
        "kana": "えらんだ",
        "romaji": "eranda"
      },
      "nai": {
        "kanji": "選ばない",
        "kana": "えらばない",
        "romaji": "erabanai"
      },
      "potential": {
        "kanji": "選べる",
        "kana": "えらべる",
        "romaji": "eraberu"
      },
      "volitional": {
        "kanji": "選ぼう",
        "kana": "えらぼう",
        "romaji": "erabou"
      },
      "imperative": {
        "kanji": "選べ",
        "kana": "えらべ",
        "romaji": "erabe"
      },
      "prohibitive": {
        "kanji": "選ぶな",
        "kana": "えらぶな",
        "romaji": "erabuna"
      },
      "passive": {
        "kanji": "選ばれる",
        "kana": "えらばれる",
        "romaji": "erabareru"
      },
      "causative": {
        "kanji": "選ばせる",
        "kana": "えらばせる",
        "romaji": "erabaseru"
      },
      "causativePassive": {
        "kanji": "選ばされる",
        "kana": "えらばされる",
        "romaji": "erabasareru"
      },
      "ba": {
        "kanji": "選べば",
        "kana": "えらべば",
        "romaji": "erabeba"
      }
    }
  },
  {
    "id": "musubu",
    "kanji": "結ぶ",
    "kana": "むすぶ",
    "romaji": "musubu",
    "english": "to tie / connect",
    "indonesian": "mengikat / menghubungkan",
    "jlpt": "N3",
    "group": 1,
    "subGroup": "bu",
    "conjugations": {
      "dictionary": {
        "kanji": "結ぶ",
        "kana": "むすぶ",
        "romaji": "musubu"
      },
      "masu": {
        "kanji": "結びます",
        "kana": "むすびます",
        "romaji": "musubimasu"
      },
      "te": {
        "kanji": "結んで",
        "kana": "むすんで",
        "romaji": "musunde"
      },
      "ta": {
        "kanji": "結んだ",
        "kana": "むすんだ",
        "romaji": "musunda"
      },
      "nai": {
        "kanji": "結ばない",
        "kana": "むすばない",
        "romaji": "musubanai"
      },
      "potential": {
        "kanji": "結べる",
        "kana": "むすべる",
        "romaji": "musuberu"
      },
      "volitional": {
        "kanji": "結ぼう",
        "kana": "むすぼう",
        "romaji": "musubou"
      },
      "imperative": {
        "kanji": "結べ",
        "kana": "むすべ",
        "romaji": "musube"
      },
      "prohibitive": {
        "kanji": "結ぶな",
        "kana": "むすぶな",
        "romaji": "musubuna"
      },
      "passive": {
        "kanji": "結ばれる",
        "kana": "むすばれる",
        "romaji": "musubareru"
      },
      "causative": {
        "kanji": "結ばせる",
        "kana": "むすばせる",
        "romaji": "musubaseru"
      },
      "causativePassive": {
        "kanji": "結ばされる",
        "kana": "むすばされる",
        "romaji": "musubasareru"
      },
      "ba": {
        "kanji": "結べば",
        "kana": "むすべば",
        "romaji": "musubeba"
      }
    }
  },
  {
    "id": "tobu_jump",
    "kanji": "跳ぶ",
    "kana": "とぶ",
    "romaji": "tobu",
    "english": "to leap / bound",
    "indonesian": "meloncat",
    "jlpt": "N2",
    "group": 1,
    "subGroup": "bu",
    "conjugations": {
      "dictionary": {
        "kanji": "跳ぶ",
        "kana": "とぶ",
        "romaji": "tobu"
      },
      "masu": {
        "kanji": "跳びます",
        "kana": "とびます",
        "romaji": "tobimasu"
      },
      "te": {
        "kanji": "跳んで",
        "kana": "とんで",
        "romaji": "tonde"
      },
      "ta": {
        "kanji": "跳んだ",
        "kana": "とんだ",
        "romaji": "tonda"
      },
      "nai": {
        "kanji": "跳ばない",
        "kana": "とばない",
        "romaji": "tobanai"
      },
      "potential": {
        "kanji": "跳べる",
        "kana": "とべる",
        "romaji": "toberu"
      },
      "volitional": {
        "kanji": "跳ぼう",
        "kana": "とぼう",
        "romaji": "tobou"
      },
      "imperative": {
        "kanji": "跳べ",
        "kana": "とべ",
        "romaji": "tobe"
      },
      "prohibitive": {
        "kanji": "跳ぶな",
        "kana": "とぶな",
        "romaji": "tobuna"
      },
      "passive": {
        "kanji": "跳ばれる",
        "kana": "とばれる",
        "romaji": "tobareru"
      },
      "causative": {
        "kanji": "跳ばせる",
        "kana": "とばせる",
        "romaji": "tobaseru"
      },
      "causativePassive": {
        "kanji": "跳ばされる",
        "kana": "とばされる",
        "romaji": "tobasareru"
      },
      "ba": {
        "kanji": "跳べば",
        "kana": "とべば",
        "romaji": "tobeba"
      }
    }
  },
  {
    "id": "shinu",
    "kanji": "死ぬ",
    "kana": "しぬ",
    "romaji": "shinu",
    "english": "to die",
    "indonesian": "mati / meninggal",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "nu",
    "conjugations": {
      "dictionary": {
        "kanji": "死ぬ",
        "kana": "しぬ",
        "romaji": "shinu"
      },
      "masu": {
        "kanji": "死にます",
        "kana": "しにます",
        "romaji": "shinimasu"
      },
      "te": {
        "kanji": "死んで",
        "kana": "しんで",
        "romaji": "shinde"
      },
      "ta": {
        "kanji": "死んだ",
        "kana": "しんだ",
        "romaji": "shinda"
      },
      "nai": {
        "kanji": "死なない",
        "kana": "しなない",
        "romaji": "shinanai"
      },
      "potential": {
        "kanji": "死ねる",
        "kana": "しねる",
        "romaji": "shineru"
      },
      "volitional": {
        "kanji": "死のう",
        "kana": "しのう",
        "romaji": "shinou"
      },
      "imperative": {
        "kanji": "死ね",
        "kana": "しね",
        "romaji": "shine"
      },
      "prohibitive": {
        "kanji": "死ぬな",
        "kana": "しぬな",
        "romaji": "shinuna"
      },
      "passive": {
        "kanji": "死なれる",
        "kana": "しなれる",
        "romaji": "shinareru"
      },
      "causative": {
        "kanji": "死なせる",
        "kana": "しなせる",
        "romaji": "shinaseru"
      },
      "causativePassive": {
        "kanji": "死なされる",
        "kana": "しなされる",
        "romaji": "shinasareru"
      },
      "ba": {
        "kanji": "死ねば",
        "kana": "しねば",
        "romaji": "shineba"
      }
    }
  },
  {
    "id": "iku",
    "kanji": "行く",
    "kana": "いく",
    "romaji": "iku",
    "english": "to go",
    "indonesian": "pergi",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "exception",
    "conjugations": {
      "dictionary": {
        "kanji": "行く",
        "kana": "いく",
        "romaji": "iku"
      },
      "masu": {
        "kanji": "行きます",
        "kana": "いきます",
        "romaji": "ikimasu"
      },
      "te": {
        "kanji": "行って",
        "kana": "いって",
        "romaji": "itte"
      },
      "ta": {
        "kanji": "行った",
        "kana": "いった",
        "romaji": "itta"
      },
      "nai": {
        "kanji": "行かない",
        "kana": "いかない",
        "romaji": "ikanai"
      },
      "potential": {
        "kanji": "行ける",
        "kana": "いける",
        "romaji": "ikeru"
      },
      "volitional": {
        "kanji": "行こう",
        "kana": "いこう",
        "romaji": "ikou"
      },
      "imperative": {
        "kanji": "行け",
        "kana": "いけ",
        "romaji": "ike"
      },
      "prohibitive": {
        "kanji": "行くな",
        "kana": "いくな",
        "romaji": "ikuna"
      },
      "passive": {
        "kanji": "行かれる",
        "kana": "いかれる",
        "romaji": "ikareru"
      },
      "causative": {
        "kanji": "行かせる",
        "kana": "いかせる",
        "romaji": "ikaseru"
      },
      "causativePassive": {
        "kanji": "行かされる",
        "kana": "いかされる",
        "romaji": "ikasareru"
      },
      "ba": {
        "kanji": "行けば",
        "kana": "いけば",
        "romaji": "ikeba"
      }
    }
  },
  {
    "id": "kaku",
    "kanji": "書く",
    "kana": "かく",
    "romaji": "kaku",
    "english": "to write",
    "indonesian": "menulis",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "書く",
        "kana": "かく",
        "romaji": "kaku"
      },
      "masu": {
        "kanji": "書きます",
        "kana": "かきます",
        "romaji": "kakimasu"
      },
      "te": {
        "kanji": "書いて",
        "kana": "かいて",
        "romaji": "kaite"
      },
      "ta": {
        "kanji": "書いた",
        "kana": "かいた",
        "romaji": "kaita"
      },
      "nai": {
        "kanji": "書かない",
        "kana": "かかない",
        "romaji": "kakanai"
      },
      "potential": {
        "kanji": "書ける",
        "kana": "かける",
        "romaji": "kakeru"
      },
      "volitional": {
        "kanji": "書こう",
        "kana": "かこう",
        "romaji": "kakou"
      },
      "imperative": {
        "kanji": "書け",
        "kana": "かけ",
        "romaji": "kake"
      },
      "prohibitive": {
        "kanji": "書くな",
        "kana": "かくな",
        "romaji": "kakuna"
      },
      "passive": {
        "kanji": "書かれる",
        "kana": "かかれる",
        "romaji": "kakareru"
      },
      "causative": {
        "kanji": "書かせる",
        "kana": "かかせる",
        "romaji": "kakaseru"
      },
      "causativePassive": {
        "kanji": "書かされる",
        "kana": "かかされる",
        "romaji": "kakasareru"
      },
      "ba": {
        "kanji": "書けば",
        "kana": "かけば",
        "romaji": "kakeba"
      }
    }
  },
  {
    "id": "kiku",
    "kanji": "聞く",
    "kana": "きく",
    "romaji": "kiku",
    "english": "to listen / ask",
    "indonesian": "mendengar / bertanya",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "聞く",
        "kana": "きく",
        "romaji": "kiku"
      },
      "masu": {
        "kanji": "聞きます",
        "kana": "ききます",
        "romaji": "kikimasu"
      },
      "te": {
        "kanji": "聞いて",
        "kana": "きいて",
        "romaji": "kiite"
      },
      "ta": {
        "kanji": "聞いた",
        "kana": "きいた",
        "romaji": "kiita"
      },
      "nai": {
        "kanji": "聞かない",
        "kana": "きかない",
        "romaji": "kikanai"
      },
      "potential": {
        "kanji": "聞ける",
        "kana": "きける",
        "romaji": "kikeru"
      },
      "volitional": {
        "kanji": "聞こう",
        "kana": "きこう",
        "romaji": "kikou"
      },
      "imperative": {
        "kanji": "聞け",
        "kana": "きけ",
        "romaji": "kike"
      },
      "prohibitive": {
        "kanji": "聞くな",
        "kana": "きくな",
        "romaji": "kikuna"
      },
      "passive": {
        "kanji": "聞かれる",
        "kana": "きかれる",
        "romaji": "kikareru"
      },
      "causative": {
        "kanji": "聞かせる",
        "kana": "きかせる",
        "romaji": "kikaseru"
      },
      "causativePassive": {
        "kanji": "聞かされる",
        "kana": "きかされる",
        "romaji": "kikasareru"
      },
      "ba": {
        "kanji": "聞けば",
        "kana": "きけば",
        "romaji": "kikeba"
      }
    }
  },
  {
    "id": "aruku",
    "kanji": "歩く",
    "kana": "あるく",
    "romaji": "aruku",
    "english": "to walk",
    "indonesian": "berjalan",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "歩く",
        "kana": "あるく",
        "romaji": "aruku"
      },
      "masu": {
        "kanji": "歩きます",
        "kana": "あるきます",
        "romaji": "arukimasu"
      },
      "te": {
        "kanji": "歩いて",
        "kana": "あるいて",
        "romaji": "aruite"
      },
      "ta": {
        "kanji": "歩いた",
        "kana": "あるいた",
        "romaji": "aruita"
      },
      "nai": {
        "kanji": "歩かない",
        "kana": "あるかない",
        "romaji": "arukanai"
      },
      "potential": {
        "kanji": "歩ける",
        "kana": "あるける",
        "romaji": "arukeru"
      },
      "volitional": {
        "kanji": "歩こう",
        "kana": "あるこう",
        "romaji": "arukou"
      },
      "imperative": {
        "kanji": "歩け",
        "kana": "あるけ",
        "romaji": "aruke"
      },
      "prohibitive": {
        "kanji": "歩くな",
        "kana": "あるくな",
        "romaji": "arukuna"
      },
      "passive": {
        "kanji": "歩かれる",
        "kana": "あるかれる",
        "romaji": "arukareru"
      },
      "causative": {
        "kanji": "歩かせる",
        "kana": "あるかせる",
        "romaji": "arukaseru"
      },
      "causativePassive": {
        "kanji": "歩かされる",
        "kana": "あるかされる",
        "romaji": "arukasareru"
      },
      "ba": {
        "kanji": "歩けば",
        "kana": "あるけば",
        "romaji": "arukeba"
      }
    }
  },
  {
    "id": "hataraku",
    "kanji": "働く",
    "kana": "はたらく",
    "romaji": "hataraku",
    "english": "to work",
    "indonesian": "bekerja",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "働く",
        "kana": "はたらく",
        "romaji": "hataraku"
      },
      "masu": {
        "kanji": "働きます",
        "kana": "はたらきます",
        "romaji": "hatarakimasu"
      },
      "te": {
        "kanji": "働いて",
        "kana": "はたらいて",
        "romaji": "hataraite"
      },
      "ta": {
        "kanji": "働いた",
        "kana": "はたらいた",
        "romaji": "hataraita"
      },
      "nai": {
        "kanji": "働かない",
        "kana": "はたらかない",
        "romaji": "hatarakanai"
      },
      "potential": {
        "kanji": "働ける",
        "kana": "はたらける",
        "romaji": "hatarakeru"
      },
      "volitional": {
        "kanji": "働こう",
        "kana": "はたらこう",
        "romaji": "hatarakou"
      },
      "imperative": {
        "kanji": "働け",
        "kana": "はたらけ",
        "romaji": "hatarake"
      },
      "prohibitive": {
        "kanji": "働くな",
        "kana": "はたらくな",
        "romaji": "hatarakuna"
      },
      "passive": {
        "kanji": "働かれる",
        "kana": "はたらかれる",
        "romaji": "hatarakareru"
      },
      "causative": {
        "kanji": "働かせる",
        "kana": "はたらかせる",
        "romaji": "hatarakaseru"
      },
      "causativePassive": {
        "kanji": "働かされる",
        "kana": "はたらかされる",
        "romaji": "hatarakasareru"
      },
      "ba": {
        "kanji": "働けば",
        "kana": "はたらけば",
        "romaji": "hatarakeba"
      }
    }
  },
  {
    "id": "oku",
    "kanji": "置く",
    "kana": "おく",
    "romaji": "oku",
    "english": "to put / place",
    "indonesian": "menaruh / meletakkan",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "置く",
        "kana": "おく",
        "romaji": "oku"
      },
      "masu": {
        "kanji": "置きます",
        "kana": "おきます",
        "romaji": "okimasu"
      },
      "te": {
        "kanji": "置いて",
        "kana": "おいて",
        "romaji": "oite"
      },
      "ta": {
        "kanji": "置いた",
        "kana": "おいた",
        "romaji": "oita"
      },
      "nai": {
        "kanji": "置かない",
        "kana": "おかない",
        "romaji": "okanai"
      },
      "potential": {
        "kanji": "置ける",
        "kana": "おける",
        "romaji": "okeru"
      },
      "volitional": {
        "kanji": "置こう",
        "kana": "おこう",
        "romaji": "okou"
      },
      "imperative": {
        "kanji": "置け",
        "kana": "おけ",
        "romaji": "oke"
      },
      "prohibitive": {
        "kanji": "置くな",
        "kana": "おくな",
        "romaji": "okuna"
      },
      "passive": {
        "kanji": "置かれる",
        "kana": "おかれる",
        "romaji": "okareru"
      },
      "causative": {
        "kanji": "置かせる",
        "kana": "おかせる",
        "romaji": "okaseru"
      },
      "causativePassive": {
        "kanji": "置かされる",
        "kana": "おかされる",
        "romaji": "okasareru"
      },
      "ba": {
        "kanji": "置けば",
        "kana": "おけば",
        "romaji": "okeba"
      }
    }
  },
  {
    "id": "tsuku",
    "kanji": "着く",
    "kana": "つく",
    "romaji": "tsuku",
    "english": "to arrive",
    "indonesian": "sampai / tiba",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "着く",
        "kana": "つく",
        "romaji": "tsuku"
      },
      "masu": {
        "kanji": "着きます",
        "kana": "つきます",
        "romaji": "tsukimasu"
      },
      "te": {
        "kanji": "着いて",
        "kana": "ついて",
        "romaji": "tsuite"
      },
      "ta": {
        "kanji": "着いた",
        "kana": "ついた",
        "romaji": "tsuita"
      },
      "nai": {
        "kanji": "着かない",
        "kana": "つかない",
        "romaji": "tsukanai"
      },
      "potential": {
        "kanji": "着ける",
        "kana": "つける",
        "romaji": "tsukeru"
      },
      "volitional": {
        "kanji": "着こう",
        "kana": "つこう",
        "romaji": "tsukou"
      },
      "imperative": {
        "kanji": "着け",
        "kana": "つけ",
        "romaji": "tsuke"
      },
      "prohibitive": {
        "kanji": "着くな",
        "kana": "つくな",
        "romaji": "tsukuna"
      },
      "passive": {
        "kanji": "着かれる",
        "kana": "つかれる",
        "romaji": "tsukareru"
      },
      "causative": {
        "kanji": "着かせる",
        "kana": "つかせる",
        "romaji": "tsukaseru"
      },
      "causativePassive": {
        "kanji": "着かされる",
        "kana": "つかされる",
        "romaji": "tsukasareru"
      },
      "ba": {
        "kanji": "着けば",
        "kana": "つけば",
        "romaji": "tsukeba"
      }
    }
  },
  {
    "id": "saku",
    "kanji": "咲く",
    "kana": "さく",
    "romaji": "saku",
    "english": "to bloom",
    "indonesian": "mekar",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "咲く",
        "kana": "さく",
        "romaji": "saku"
      },
      "masu": {
        "kanji": "咲きます",
        "kana": "さきます",
        "romaji": "sakimasu"
      },
      "te": {
        "kanji": "咲いて",
        "kana": "さいて",
        "romaji": "saite"
      },
      "ta": {
        "kanji": "咲いた",
        "kana": "さいた",
        "romaji": "saita"
      },
      "nai": {
        "kanji": "咲かない",
        "kana": "さかない",
        "romaji": "sakanai"
      },
      "potential": {
        "kanji": "咲ける",
        "kana": "さける",
        "romaji": "sakeru"
      },
      "volitional": {
        "kanji": "咲こう",
        "kana": "さこう",
        "romaji": "sakou"
      },
      "imperative": {
        "kanji": "咲け",
        "kana": "さけ",
        "romaji": "sake"
      },
      "prohibitive": {
        "kanji": "咲くな",
        "kana": "さくな",
        "romaji": "sakuna"
      },
      "passive": {
        "kanji": "咲かれる",
        "kana": "さかれる",
        "romaji": "sakareru"
      },
      "causative": {
        "kanji": "咲かせる",
        "kana": "さかせる",
        "romaji": "sakaseru"
      },
      "causativePassive": {
        "kanji": "咲かされる",
        "kana": "さかされる",
        "romaji": "sakasareru"
      },
      "ba": {
        "kanji": "咲けば",
        "kana": "さけば",
        "romaji": "sakeba"
      }
    }
  },
  {
    "id": "migaku",
    "kanji": "磨く",
    "kana": "みがく",
    "romaji": "migaku",
    "english": "to polish / brush",
    "indonesian": "menggosok / mengasah",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "磨く",
        "kana": "みがく",
        "romaji": "migaku"
      },
      "masu": {
        "kanji": "磨きます",
        "kana": "みがきます",
        "romaji": "migakimasu"
      },
      "te": {
        "kanji": "磨いて",
        "kana": "みがいて",
        "romaji": "migaite"
      },
      "ta": {
        "kanji": "磨いた",
        "kana": "みがいた",
        "romaji": "migaita"
      },
      "nai": {
        "kanji": "磨かない",
        "kana": "みがかない",
        "romaji": "migakanai"
      },
      "potential": {
        "kanji": "磨ける",
        "kana": "みがける",
        "romaji": "migakeru"
      },
      "volitional": {
        "kanji": "磨こう",
        "kana": "みがこう",
        "romaji": "migakou"
      },
      "imperative": {
        "kanji": "磨け",
        "kana": "みがけ",
        "romaji": "migake"
      },
      "prohibitive": {
        "kanji": "磨くな",
        "kana": "みがくな",
        "romaji": "migakuna"
      },
      "passive": {
        "kanji": "磨かれる",
        "kana": "みがかれる",
        "romaji": "migakareru"
      },
      "causative": {
        "kanji": "磨かせる",
        "kana": "みがかせる",
        "romaji": "migakaseru"
      },
      "causativePassive": {
        "kanji": "磨かされる",
        "kana": "みがかされる",
        "romaji": "migakasareru"
      },
      "ba": {
        "kanji": "磨けば",
        "kana": "みがけば",
        "romaji": "migakeba"
      }
    }
  },
  {
    "id": "aku",
    "kanji": "開く",
    "kana": "あく",
    "romaji": "aku",
    "english": "to open (intransitive)",
    "indonesian": "terbuka",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "開く",
        "kana": "あく",
        "romaji": "aku"
      },
      "masu": {
        "kanji": "開きます",
        "kana": "あきます",
        "romaji": "akimasu"
      },
      "te": {
        "kanji": "開いて",
        "kana": "あいて",
        "romaji": "aite"
      },
      "ta": {
        "kanji": "開いた",
        "kana": "あいた",
        "romaji": "aita"
      },
      "nai": {
        "kanji": "開かない",
        "kana": "あかない",
        "romaji": "akanai"
      },
      "potential": {
        "kanji": "開ける",
        "kana": "あける",
        "romaji": "akeru"
      },
      "volitional": {
        "kanji": "開こう",
        "kana": "あこう",
        "romaji": "akou"
      },
      "imperative": {
        "kanji": "開け",
        "kana": "あけ",
        "romaji": "ake"
      },
      "prohibitive": {
        "kanji": "開くな",
        "kana": "あくな",
        "romaji": "akuna"
      },
      "passive": {
        "kanji": "開かれる",
        "kana": "あかれる",
        "romaji": "akareru"
      },
      "causative": {
        "kanji": "開かせる",
        "kana": "あかせる",
        "romaji": "akaseru"
      },
      "causativePassive": {
        "kanji": "開かされる",
        "kana": "あかされる",
        "romaji": "akasareru"
      },
      "ba": {
        "kanji": "開けば",
        "kana": "あけば",
        "romaji": "akeba"
      }
    }
  },
  {
    "id": "tsuku_turn_on",
    "kanji": "付く",
    "kana": "つく",
    "romaji": "tsuku",
    "english": "to attach / adhere",
    "indonesian": "menempel / terpasang",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "付く",
        "kana": "つく",
        "romaji": "tsuku"
      },
      "masu": {
        "kanji": "付きます",
        "kana": "つきます",
        "romaji": "tsukimasu"
      },
      "te": {
        "kanji": "付いて",
        "kana": "ついて",
        "romaji": "tsuite"
      },
      "ta": {
        "kanji": "付いた",
        "kana": "ついた",
        "romaji": "tsuita"
      },
      "nai": {
        "kanji": "付かない",
        "kana": "つかない",
        "romaji": "tsukanai"
      },
      "potential": {
        "kanji": "付ける",
        "kana": "つける",
        "romaji": "tsukeru"
      },
      "volitional": {
        "kanji": "付こう",
        "kana": "つこう",
        "romaji": "tsukou"
      },
      "imperative": {
        "kanji": "付け",
        "kana": "つけ",
        "romaji": "tsuke"
      },
      "prohibitive": {
        "kanji": "付くな",
        "kana": "つくな",
        "romaji": "tsukuna"
      },
      "passive": {
        "kanji": "付かれる",
        "kana": "つかれる",
        "romaji": "tsukareru"
      },
      "causative": {
        "kanji": "付かせる",
        "kana": "つかせる",
        "romaji": "tsukaseru"
      },
      "causativePassive": {
        "kanji": "付かされる",
        "kana": "つかされる",
        "romaji": "tsukasareru"
      },
      "ba": {
        "kanji": "付けば",
        "kana": "つけば",
        "romaji": "tsukeba"
      }
    }
  },
  {
    "id": "nakusu",
    "kanji": "無す",
    "kana": "なくす",
    "romaji": "nakusu",
    "english": "to lose something",
    "indonesian": "kehilangan",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "無す",
        "kana": "なくす",
        "romaji": "nakusu"
      },
      "masu": {
        "kanji": "無します",
        "kana": "なくします",
        "romaji": "nakushimasu"
      },
      "te": {
        "kanji": "無して",
        "kana": "なくして",
        "romaji": "nakushite"
      },
      "ta": {
        "kanji": "無した",
        "kana": "なくした",
        "romaji": "nakushita"
      },
      "nai": {
        "kanji": "無さない",
        "kana": "なくさない",
        "romaji": "nakusanai"
      },
      "potential": {
        "kanji": "無せる",
        "kana": "なくせる",
        "romaji": "nakuseru"
      },
      "volitional": {
        "kanji": "無そう",
        "kana": "なくそう",
        "romaji": "nakusou"
      },
      "imperative": {
        "kanji": "無せ",
        "kana": "なくせ",
        "romaji": "nakuse"
      },
      "prohibitive": {
        "kanji": "無すな",
        "kana": "なくすな",
        "romaji": "nakusuna"
      },
      "passive": {
        "kanji": "無される",
        "kana": "なくされる",
        "romaji": "nakusareru"
      },
      "causative": {
        "kanji": "無させる",
        "kana": "なくさせる",
        "romaji": "nakusaseru"
      },
      "causativePassive": {
        "kanji": "無ささせられる",
        "kana": "なくささせられる",
        "romaji": "nakusasaserareru"
      },
      "ba": {
        "kanji": "無せば",
        "kana": "なくせば",
        "romaji": "nakuseba"
      }
    }
  },
  {
    "id": "naku",
    "kanji": "泣く",
    "kana": "なく",
    "romaji": "naku",
    "english": "to cry",
    "indonesian": "menangis",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "泣く",
        "kana": "なく",
        "romaji": "naku"
      },
      "masu": {
        "kanji": "泣きます",
        "kana": "なきます",
        "romaji": "nakimasu"
      },
      "te": {
        "kanji": "泣いて",
        "kana": "ないて",
        "romaji": "naite"
      },
      "ta": {
        "kanji": "泣いた",
        "kana": "ないた",
        "romaji": "naita"
      },
      "nai": {
        "kanji": "泣かない",
        "kana": "なかない",
        "romaji": "nakanai"
      },
      "potential": {
        "kanji": "泣ける",
        "kana": "なける",
        "romaji": "nakeru"
      },
      "volitional": {
        "kanji": "泣こう",
        "kana": "なこう",
        "romaji": "nakou"
      },
      "imperative": {
        "kanji": "泣け",
        "kana": "なけ",
        "romaji": "nake"
      },
      "prohibitive": {
        "kanji": "泣くな",
        "kana": "なくな",
        "romaji": "nakuna"
      },
      "passive": {
        "kanji": "泣かれる",
        "kana": "なかれる",
        "romaji": "nakareru"
      },
      "causative": {
        "kanji": "泣かせる",
        "kana": "なかせる",
        "romaji": "nakaseru"
      },
      "causativePassive": {
        "kanji": "泣かされる",
        "kana": "なかされる",
        "romaji": "nakasareru"
      },
      "ba": {
        "kanji": "泣けば",
        "kana": "なけば",
        "romaji": "nakeba"
      }
    }
  },
  {
    "id": "haku",
    "kanji": "履く",
    "kana": "はく",
    "romaji": "haku",
    "english": "to wear (shoes/pants)",
    "indonesian": "memakai (bawahan)",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "ku",
    "conjugations": {
      "dictionary": {
        "kanji": "履く",
        "kana": "はく",
        "romaji": "haku"
      },
      "masu": {
        "kanji": "履きます",
        "kana": "はきます",
        "romaji": "hakimasu"
      },
      "te": {
        "kanji": "履いて",
        "kana": "はいて",
        "romaji": "haite"
      },
      "ta": {
        "kanji": "履いた",
        "kana": "はいた",
        "romaji": "haita"
      },
      "nai": {
        "kanji": "履かない",
        "kana": "はかない",
        "romaji": "hakanai"
      },
      "potential": {
        "kanji": "履ける",
        "kana": "はける",
        "romaji": "hakeru"
      },
      "volitional": {
        "kanji": "履こう",
        "kana": "はこう",
        "romaji": "hakou"
      },
      "imperative": {
        "kanji": "履け",
        "kana": "はけ",
        "romaji": "hake"
      },
      "prohibitive": {
        "kanji": "履くな",
        "kana": "はくな",
        "romaji": "hakuna"
      },
      "passive": {
        "kanji": "履かれる",
        "kana": "はかれる",
        "romaji": "hakareru"
      },
      "causative": {
        "kanji": "履かせる",
        "kana": "はかせる",
        "romaji": "hakaseru"
      },
      "causativePassive": {
        "kanji": "履かされる",
        "kana": "はかされる",
        "romaji": "hakasareru"
      },
      "ba": {
        "kanji": "履けば",
        "kana": "はけば",
        "romaji": "hakeba"
      }
    }
  },
  {
    "id": "oyogu",
    "kanji": "泳ぐ",
    "kana": "およぐ",
    "romaji": "oyogu",
    "english": "to swim",
    "indonesian": "berenang",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "gu",
    "conjugations": {
      "dictionary": {
        "kanji": "泳ぐ",
        "kana": "およぐ",
        "romaji": "oyogu"
      },
      "masu": {
        "kanji": "泳ぎます",
        "kana": "およぎます",
        "romaji": "oyogimasu"
      },
      "te": {
        "kanji": "泳いで",
        "kana": "およいで",
        "romaji": "oyoide"
      },
      "ta": {
        "kanji": "泳いだ",
        "kana": "およいだ",
        "romaji": "oyoida"
      },
      "nai": {
        "kanji": "泳がない",
        "kana": "およがない",
        "romaji": "oyoganai"
      },
      "potential": {
        "kanji": "泳げる",
        "kana": "およげる",
        "romaji": "oyogeru"
      },
      "volitional": {
        "kanji": "泳ごう",
        "kana": "およごう",
        "romaji": "oyogou"
      },
      "imperative": {
        "kanji": "泳げ",
        "kana": "およげ",
        "romaji": "oyoge"
      },
      "prohibitive": {
        "kanji": "泳ぐな",
        "kana": "およぐな",
        "romaji": "oyoguna"
      },
      "passive": {
        "kanji": "泳がれる",
        "kana": "およがれる",
        "romaji": "oyogareru"
      },
      "causative": {
        "kanji": "泳がせる",
        "kana": "およがせる",
        "romaji": "oyogaseru"
      },
      "causativePassive": {
        "kanji": "泳がされる",
        "kana": "およがされる",
        "romaji": "oyogasareru"
      },
      "ba": {
        "kanji": "泳げば",
        "kana": "およげば",
        "romaji": "oyogeba"
      }
    }
  },
  {
    "id": "isogu",
    "kanji": "急ぐ",
    "kana": "いそぐ",
    "romaji": "isogu",
    "english": "to hurry",
    "indonesian": "terburu-buru",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "gu",
    "conjugations": {
      "dictionary": {
        "kanji": "急ぐ",
        "kana": "いそぐ",
        "romaji": "isogu"
      },
      "masu": {
        "kanji": "急ぎます",
        "kana": "いそぎます",
        "romaji": "isogimasu"
      },
      "te": {
        "kanji": "急いで",
        "kana": "いそいで",
        "romaji": "isoide"
      },
      "ta": {
        "kanji": "急いだ",
        "kana": "いそいだ",
        "romaji": "isoida"
      },
      "nai": {
        "kanji": "急がない",
        "kana": "いそがない",
        "romaji": "isoganai"
      },
      "potential": {
        "kanji": "急げる",
        "kana": "いそげる",
        "romaji": "isogeru"
      },
      "volitional": {
        "kanji": "急ごう",
        "kana": "いそごう",
        "romaji": "isogou"
      },
      "imperative": {
        "kanji": "急げ",
        "kana": "いそげ",
        "romaji": "isoge"
      },
      "prohibitive": {
        "kanji": "急ぐな",
        "kana": "いそぐな",
        "romaji": "isoguna"
      },
      "passive": {
        "kanji": "急がれる",
        "kana": "いそがれる",
        "romaji": "isogareru"
      },
      "causative": {
        "kanji": "急がせる",
        "kana": "いそがせる",
        "romaji": "isogaseru"
      },
      "causativePassive": {
        "kanji": "急がされる",
        "kana": "いそがされる",
        "romaji": "isogasareru"
      },
      "ba": {
        "kanji": "急げば",
        "kana": "いそげば",
        "romaji": "isogeba"
      }
    }
  },
  {
    "id": "nugu",
    "kanji": "脱ぐ",
    "kana": "ぬぐ",
    "romaji": "nugu",
    "english": "to take off (clothes)",
    "indonesian": "melepas (pakaian)",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "gu",
    "conjugations": {
      "dictionary": {
        "kanji": "脱ぐ",
        "kana": "ぬぐ",
        "romaji": "nugu"
      },
      "masu": {
        "kanji": "脱ぎます",
        "kana": "ぬぎます",
        "romaji": "nugimasu"
      },
      "te": {
        "kanji": "脱いで",
        "kana": "ぬいで",
        "romaji": "nuide"
      },
      "ta": {
        "kanji": "脱いだ",
        "kana": "ぬいだ",
        "romaji": "nuida"
      },
      "nai": {
        "kanji": "脱がない",
        "kana": "ぬがない",
        "romaji": "nuganai"
      },
      "potential": {
        "kanji": "脱げる",
        "kana": "ぬげる",
        "romaji": "nugeru"
      },
      "volitional": {
        "kanji": "脱ごう",
        "kana": "ぬごう",
        "romaji": "nugou"
      },
      "imperative": {
        "kanji": "脱げ",
        "kana": "ぬげ",
        "romaji": "nuge"
      },
      "prohibitive": {
        "kanji": "脱ぐな",
        "kana": "ぬぐな",
        "romaji": "nuguna"
      },
      "passive": {
        "kanji": "脱がれる",
        "kana": "ぬがれる",
        "romaji": "nugareru"
      },
      "causative": {
        "kanji": "脱がせる",
        "kana": "ぬがせる",
        "romaji": "nugaseru"
      },
      "causativePassive": {
        "kanji": "脱がされる",
        "kana": "ぬがされる",
        "romaji": "nugasareru"
      },
      "ba": {
        "kanji": "脱げば",
        "kana": "ぬげば",
        "romaji": "nugeba"
      }
    }
  },
  {
    "id": "kagu",
    "kanji": "嗅ぐ",
    "kana": "かぐ",
    "romaji": "kagu",
    "english": "to smell / sniff",
    "indonesian": "mencium bau",
    "jlpt": "N2",
    "group": 1,
    "subGroup": "gu",
    "conjugations": {
      "dictionary": {
        "kanji": "嗅ぐ",
        "kana": "かぐ",
        "romaji": "kagu"
      },
      "masu": {
        "kanji": "嗅ぎます",
        "kana": "かぎます",
        "romaji": "kagimasu"
      },
      "te": {
        "kanji": "嗅いで",
        "kana": "かいで",
        "romaji": "kaide"
      },
      "ta": {
        "kanji": "嗅いだ",
        "kana": "かいだ",
        "romaji": "kaida"
      },
      "nai": {
        "kanji": "嗅がない",
        "kana": "かがない",
        "romaji": "kaganai"
      },
      "potential": {
        "kanji": "嗅げる",
        "kana": "かげる",
        "romaji": "kageru"
      },
      "volitional": {
        "kanji": "嗅ごう",
        "kana": "かごう",
        "romaji": "kagou"
      },
      "imperative": {
        "kanji": "嗅げ",
        "kana": "かげ",
        "romaji": "kage"
      },
      "prohibitive": {
        "kanji": "嗅ぐな",
        "kana": "かぐな",
        "romaji": "kaguna"
      },
      "passive": {
        "kanji": "嗅がれる",
        "kana": "かがれる",
        "romaji": "kagareru"
      },
      "causative": {
        "kanji": "嗅がせる",
        "kana": "かがせる",
        "romaji": "kagaseru"
      },
      "causativePassive": {
        "kanji": "嗅がされる",
        "kana": "かがされる",
        "romaji": "kagasareru"
      },
      "ba": {
        "kanji": "嗅げば",
        "kana": "かげば",
        "romaji": "kageba"
      }
    }
  },
  {
    "id": "sawagu",
    "kanji": "騒ぐ",
    "kana": "さわぐ",
    "romaji": "sawagu",
    "english": "to make noise",
    "indonesian": "membuat kebisingan",
    "jlpt": "N3",
    "group": 1,
    "subGroup": "gu",
    "conjugations": {
      "dictionary": {
        "kanji": "騒ぐ",
        "kana": "さわぐ",
        "romaji": "sawagu"
      },
      "masu": {
        "kanji": "騒ぎます",
        "kana": "さわぎます",
        "romaji": "sawagimasu"
      },
      "te": {
        "kanji": "騒いで",
        "kana": "さわいで",
        "romaji": "sawaide"
      },
      "ta": {
        "kanji": "騒いだ",
        "kana": "さわいだ",
        "romaji": "sawaida"
      },
      "nai": {
        "kanji": "騒がない",
        "kana": "さわがない",
        "romaji": "sawaganai"
      },
      "potential": {
        "kanji": "騒げる",
        "kana": "さわげる",
        "romaji": "sawageru"
      },
      "volitional": {
        "kanji": "騒ごう",
        "kana": "さわごう",
        "romaji": "sawagou"
      },
      "imperative": {
        "kanji": "騒げ",
        "kana": "さわげ",
        "romaji": "sawage"
      },
      "prohibitive": {
        "kanji": "騒ぐな",
        "kana": "さわぐな",
        "romaji": "sawaguna"
      },
      "passive": {
        "kanji": "騒がれる",
        "kana": "さわがれる",
        "romaji": "sawagareru"
      },
      "causative": {
        "kanji": "騒がせる",
        "kana": "さわがせる",
        "romaji": "sawagaseru"
      },
      "causativePassive": {
        "kanji": "騒がされる",
        "kana": "さわがされる",
        "romaji": "sawagasareru"
      },
      "ba": {
        "kanji": "騒げば",
        "kana": "さわげば",
        "romaji": "sawageba"
      }
    }
  },
  {
    "id": "hanasu",
    "kanji": "話す",
    "kana": "はなす",
    "romaji": "hanasu",
    "english": "to speak",
    "indonesian": "berbicara",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "話す",
        "kana": "はなす",
        "romaji": "hanasu"
      },
      "masu": {
        "kanji": "話します",
        "kana": "はなします",
        "romaji": "hanashimasu"
      },
      "te": {
        "kanji": "話して",
        "kana": "はなして",
        "romaji": "hanashite"
      },
      "ta": {
        "kanji": "話した",
        "kana": "はなした",
        "romaji": "hanashita"
      },
      "nai": {
        "kanji": "話さない",
        "kana": "はなさない",
        "romaji": "hanasanai"
      },
      "potential": {
        "kanji": "話せる",
        "kana": "はなせる",
        "romaji": "hanaseru"
      },
      "volitional": {
        "kanji": "話そう",
        "kana": "はなそう",
        "romaji": "hanasou"
      },
      "imperative": {
        "kanji": "話せ",
        "kana": "はなせ",
        "romaji": "hanase"
      },
      "prohibitive": {
        "kanji": "話すな",
        "kana": "はなすな",
        "romaji": "hanasuna"
      },
      "passive": {
        "kanji": "話される",
        "kana": "はなされる",
        "romaji": "hanasareru"
      },
      "causative": {
        "kanji": "話させる",
        "kana": "はなさせる",
        "romaji": "hanasaseru"
      },
      "causativePassive": {
        "kanji": "話ささせられる",
        "kana": "はなささせられる",
        "romaji": "hanasasaserareru"
      },
      "ba": {
        "kanji": "話せば",
        "kana": "はなせば",
        "romaji": "hanaseba"
      }
    }
  },
  {
    "id": "dasu",
    "kanji": "出す",
    "kana": "だす",
    "romaji": "dasu",
    "english": "to take out / hand in",
    "indonesian": "mengeluarkan / menyerahkan",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "出す",
        "kana": "だす",
        "romaji": "dasu"
      },
      "masu": {
        "kanji": "出します",
        "kana": "だします",
        "romaji": "dashimasu"
      },
      "te": {
        "kanji": "出して",
        "kana": "だして",
        "romaji": "dashite"
      },
      "ta": {
        "kanji": "出した",
        "kana": "だした",
        "romaji": "dashita"
      },
      "nai": {
        "kanji": "出さない",
        "kana": "ださない",
        "romaji": "dasanai"
      },
      "potential": {
        "kanji": "出せる",
        "kana": "だせる",
        "romaji": "daseru"
      },
      "volitional": {
        "kanji": "出そう",
        "kana": "だそう",
        "romaji": "dasou"
      },
      "imperative": {
        "kanji": "出せ",
        "kana": "だせ",
        "romaji": "dase"
      },
      "prohibitive": {
        "kanji": "出すな",
        "kana": "だすな",
        "romaji": "dasuna"
      },
      "passive": {
        "kanji": "出される",
        "kana": "だされる",
        "romaji": "dasareru"
      },
      "causative": {
        "kanji": "出させる",
        "kana": "ださせる",
        "romaji": "dasaseru"
      },
      "causativePassive": {
        "kanji": "出ささせられる",
        "kana": "だささせられる",
        "romaji": "dasasaserareru"
      },
      "ba": {
        "kanji": "出せば",
        "kana": "だせば",
        "romaji": "daseba"
      }
    }
  },
  {
    "id": "kaesu",
    "kanji": "返す",
    "kana": "かえす",
    "romaji": "kaesu",
    "english": "to return (something)",
    "indonesian": "mengembalikan",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "返す",
        "kana": "かえす",
        "romaji": "kaesu"
      },
      "masu": {
        "kanji": "返します",
        "kana": "かえします",
        "romaji": "kaeshimasu"
      },
      "te": {
        "kanji": "返して",
        "kana": "かえして",
        "romaji": "kaeshite"
      },
      "ta": {
        "kanji": "返した",
        "kana": "かえした",
        "romaji": "kaeshita"
      },
      "nai": {
        "kanji": "返さない",
        "kana": "かえさない",
        "romaji": "kaesanai"
      },
      "potential": {
        "kanji": "返せる",
        "kana": "かえせる",
        "romaji": "kaeseru"
      },
      "volitional": {
        "kanji": "返そう",
        "kana": "かえそう",
        "romaji": "kaesou"
      },
      "imperative": {
        "kanji": "返せ",
        "kana": "かえせ",
        "romaji": "kaese"
      },
      "prohibitive": {
        "kanji": "返すな",
        "kana": "かえすな",
        "romaji": "kaesuna"
      },
      "passive": {
        "kanji": "返される",
        "kana": "かえされる",
        "romaji": "kaesareru"
      },
      "causative": {
        "kanji": "返させる",
        "kana": "かえさせる",
        "romaji": "kaesaseru"
      },
      "causativePassive": {
        "kanji": "返ささせられる",
        "kana": "かえささせられる",
        "romaji": "kaesasaserareru"
      },
      "ba": {
        "kanji": "返せば",
        "kana": "かえせば",
        "romaji": "kaeseba"
      }
    }
  },
  {
    "id": "osu",
    "kanji": "押す",
    "kana": "おす",
    "romaji": "osu",
    "english": "to push",
    "indonesian": "mendorong / menekan",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "押す",
        "kana": "おす",
        "romaji": "osu"
      },
      "masu": {
        "kanji": "押します",
        "kana": "おします",
        "romaji": "oshimasu"
      },
      "te": {
        "kanji": "押して",
        "kana": "おして",
        "romaji": "oshite"
      },
      "ta": {
        "kanji": "押した",
        "kana": "おした",
        "romaji": "oshita"
      },
      "nai": {
        "kanji": "押さない",
        "kana": "おさない",
        "romaji": "osanai"
      },
      "potential": {
        "kanji": "押せる",
        "kana": "おせる",
        "romaji": "oseru"
      },
      "volitional": {
        "kanji": "押そう",
        "kana": "おそう",
        "romaji": "osou"
      },
      "imperative": {
        "kanji": "押せ",
        "kana": "おせ",
        "romaji": "ose"
      },
      "prohibitive": {
        "kanji": "押すな",
        "kana": "おすな",
        "romaji": "osuna"
      },
      "passive": {
        "kanji": "押される",
        "kana": "おされる",
        "romaji": "osareru"
      },
      "causative": {
        "kanji": "押させる",
        "kana": "おさせる",
        "romaji": "osaseru"
      },
      "causativePassive": {
        "kanji": "押ささせられる",
        "kana": "おささせられる",
        "romaji": "osasaserareru"
      },
      "ba": {
        "kanji": "押せば",
        "kana": "おせば",
        "romaji": "oseba"
      }
    }
  },
  {
    "id": "kesu",
    "kanji": "消す",
    "kana": "けす",
    "romaji": "kesu",
    "english": "to turn off / erase",
    "indonesian": "mematikan / menghapus",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "消す",
        "kana": "けす",
        "romaji": "kesu"
      },
      "masu": {
        "kanji": "消します",
        "kana": "けします",
        "romaji": "keshimasu"
      },
      "te": {
        "kanji": "消して",
        "kana": "けして",
        "romaji": "keshite"
      },
      "ta": {
        "kanji": "消した",
        "kana": "けした",
        "romaji": "keshita"
      },
      "nai": {
        "kanji": "消さない",
        "kana": "けさない",
        "romaji": "kesanai"
      },
      "potential": {
        "kanji": "消せる",
        "kana": "けせる",
        "romaji": "keseru"
      },
      "volitional": {
        "kanji": "消そう",
        "kana": "けそう",
        "romaji": "kesou"
      },
      "imperative": {
        "kanji": "消せ",
        "kana": "けせ",
        "romaji": "kese"
      },
      "prohibitive": {
        "kanji": "消すな",
        "kana": "けすな",
        "romaji": "kesuna"
      },
      "passive": {
        "kanji": "消される",
        "kana": "けされる",
        "romaji": "kesareru"
      },
      "causative": {
        "kanji": "消させる",
        "kana": "けさせる",
        "romaji": "kesaseru"
      },
      "causativePassive": {
        "kanji": "消ささせられる",
        "kana": "けささせられる",
        "romaji": "kesasaserareru"
      },
      "ba": {
        "kanji": "消せば",
        "kana": "けせば",
        "romaji": "keseba"
      }
    }
  },
  {
    "id": "sagasu",
    "kanji": "探す",
    "kana": "さがす",
    "romaji": "sagasu",
    "english": "to search for",
    "indonesian": "mencari",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "探す",
        "kana": "さがす",
        "romaji": "sagasu"
      },
      "masu": {
        "kanji": "探します",
        "kana": "さがします",
        "romaji": "sagashimasu"
      },
      "te": {
        "kanji": "探して",
        "kana": "さがして",
        "romaji": "sagashite"
      },
      "ta": {
        "kanji": "探した",
        "kana": "さがした",
        "romaji": "sagashita"
      },
      "nai": {
        "kanji": "探さない",
        "kana": "さがさない",
        "romaji": "sagasanai"
      },
      "potential": {
        "kanji": "探せる",
        "kana": "さがせる",
        "romaji": "sagaseru"
      },
      "volitional": {
        "kanji": "探そう",
        "kana": "さがそう",
        "romaji": "sagasou"
      },
      "imperative": {
        "kanji": "探せ",
        "kana": "さがせ",
        "romaji": "sagase"
      },
      "prohibitive": {
        "kanji": "探すな",
        "kana": "さがすな",
        "romaji": "sagasuna"
      },
      "passive": {
        "kanji": "探される",
        "kana": "さがされる",
        "romaji": "sagasareru"
      },
      "causative": {
        "kanji": "探させる",
        "kana": "さがさせる",
        "romaji": "sagasaseru"
      },
      "causativePassive": {
        "kanji": "探ささせられる",
        "kana": "さがささせられる",
        "romaji": "sagasasaserareru"
      },
      "ba": {
        "kanji": "探せば",
        "kana": "さがせば",
        "romaji": "sagaseba"
      }
    }
  },
  {
    "id": "naosu",
    "kanji": "直す",
    "kana": "なおす",
    "romaji": "naosu",
    "english": "to repair / correct",
    "indonesian": "memperbaiki",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "直す",
        "kana": "なおす",
        "romaji": "naosu"
      },
      "masu": {
        "kanji": "直します",
        "kana": "なおします",
        "romaji": "naoshimasu"
      },
      "te": {
        "kanji": "直して",
        "kana": "なおして",
        "romaji": "naoshite"
      },
      "ta": {
        "kanji": "直した",
        "kana": "なおした",
        "romaji": "naoshita"
      },
      "nai": {
        "kanji": "直さない",
        "kana": "なおさない",
        "romaji": "naosanai"
      },
      "potential": {
        "kanji": "直せる",
        "kana": "なおせる",
        "romaji": "naoseru"
      },
      "volitional": {
        "kanji": "直そう",
        "kana": "なおそう",
        "romaji": "naosou"
      },
      "imperative": {
        "kanji": "直せ",
        "kana": "なおせ",
        "romaji": "naose"
      },
      "prohibitive": {
        "kanji": "直すな",
        "kana": "なおすな",
        "romaji": "naosuna"
      },
      "passive": {
        "kanji": "直される",
        "kana": "なおされる",
        "romaji": "naosareru"
      },
      "causative": {
        "kanji": "直させる",
        "kana": "なおさせる",
        "romaji": "naosaseru"
      },
      "causativePassive": {
        "kanji": "直ささせられる",
        "kana": "なおささせられる",
        "romaji": "naosasaserareru"
      },
      "ba": {
        "kanji": "直せば",
        "kana": "なおせば",
        "romaji": "naoseba"
      }
    }
  },
  {
    "id": "watasu",
    "kanji": "渡す",
    "kana": "わたす",
    "romaji": "watasu",
    "english": "to hand over",
    "indonesian": "menyerahkan",
    "jlpt": "N5",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "渡す",
        "kana": "わたす",
        "romaji": "watasu"
      },
      "masu": {
        "kanji": "渡します",
        "kana": "わたします",
        "romaji": "watashimasu"
      },
      "te": {
        "kanji": "渡して",
        "kana": "わたして",
        "romaji": "watashite"
      },
      "ta": {
        "kanji": "渡した",
        "kana": "わたした",
        "romaji": "watashita"
      },
      "nai": {
        "kanji": "渡さない",
        "kana": "わたさない",
        "romaji": "watasanai"
      },
      "potential": {
        "kanji": "渡せる",
        "kana": "わたせる",
        "romaji": "wataseru"
      },
      "volitional": {
        "kanji": "渡そう",
        "kana": "わたそう",
        "romaji": "watasou"
      },
      "imperative": {
        "kanji": "渡せ",
        "kana": "わたせ",
        "romaji": "watase"
      },
      "prohibitive": {
        "kanji": "渡すな",
        "kana": "わたすな",
        "romaji": "watasuna"
      },
      "passive": {
        "kanji": "渡される",
        "kana": "わたされる",
        "romaji": "watasareru"
      },
      "causative": {
        "kanji": "渡させる",
        "kana": "わたさせる",
        "romaji": "watasaseru"
      },
      "causativePassive": {
        "kanji": "渡ささせられる",
        "kana": "わたささせられる",
        "romaji": "watasasaserareru"
      },
      "ba": {
        "kanji": "渡せば",
        "kana": "わたせば",
        "romaji": "wataseba"
      }
    }
  },
  {
    "id": "okosu",
    "kanji": "起こす",
    "kana": "おこす",
    "romaji": "okosu",
    "english": "to wake someone up",
    "indonesian": "membangunkan seseorang",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "起こす",
        "kana": "おこす",
        "romaji": "okosu"
      },
      "masu": {
        "kanji": "起こします",
        "kana": "おこします",
        "romaji": "okoshimasu"
      },
      "te": {
        "kanji": "起こして",
        "kana": "おこして",
        "romaji": "okoshite"
      },
      "ta": {
        "kanji": "起こした",
        "kana": "おこした",
        "romaji": "okoshita"
      },
      "nai": {
        "kanji": "起こさない",
        "kana": "おこさない",
        "romaji": "okosanai"
      },
      "potential": {
        "kanji": "起こせる",
        "kana": "おこせる",
        "romaji": "okoseru"
      },
      "volitional": {
        "kanji": "起こそう",
        "kana": "おこそう",
        "romaji": "okosou"
      },
      "imperative": {
        "kanji": "起こせ",
        "kana": "おこせ",
        "romaji": "okose"
      },
      "prohibitive": {
        "kanji": "起こすな",
        "kana": "おこすな",
        "romaji": "okosuna"
      },
      "passive": {
        "kanji": "起こされる",
        "kana": "おこされる",
        "romaji": "okosareru"
      },
      "causative": {
        "kanji": "起こさせる",
        "kana": "おこさせる",
        "romaji": "okosaseru"
      },
      "causativePassive": {
        "kanji": "起こささせられる",
        "kana": "おこささせられる",
        "romaji": "okosasaserareru"
      },
      "ba": {
        "kanji": "起こせば",
        "kana": "おこせば",
        "romaji": "okoseba"
      }
    }
  },
  {
    "id": "nakusu_su",
    "kanji": "無くす",
    "kana": "なくす",
    "romaji": "nakusu",
    "english": "to lose (object)",
    "indonesian": "menghilangkan",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "無くす",
        "kana": "なくす",
        "romaji": "nakusu"
      },
      "masu": {
        "kanji": "無くします",
        "kana": "なくします",
        "romaji": "nakushimasu"
      },
      "te": {
        "kanji": "無くして",
        "kana": "なくして",
        "romaji": "nakushite"
      },
      "ta": {
        "kanji": "無くした",
        "kana": "なくした",
        "romaji": "nakushita"
      },
      "nai": {
        "kanji": "無くさない",
        "kana": "なくさない",
        "romaji": "nakusanai"
      },
      "potential": {
        "kanji": "無くせる",
        "kana": "なくせる",
        "romaji": "nakuseru"
      },
      "volitional": {
        "kanji": "無くそう",
        "kana": "なくそう",
        "romaji": "nakusou"
      },
      "imperative": {
        "kanji": "無くせ",
        "kana": "なくせ",
        "romaji": "nakuse"
      },
      "prohibitive": {
        "kanji": "無くすな",
        "kana": "なくすな",
        "romaji": "nakusuna"
      },
      "passive": {
        "kanji": "無くされる",
        "kana": "なくされる",
        "romaji": "nakusareru"
      },
      "causative": {
        "kanji": "無くさせる",
        "kana": "なくさせる",
        "romaji": "nakusaseru"
      },
      "causativePassive": {
        "kanji": "無くささせられる",
        "kana": "なくささせられる",
        "romaji": "nakusasaserareru"
      },
      "ba": {
        "kanji": "無くせば",
        "kana": "なくせば",
        "romaji": "nakuseba"
      }
    }
  },
  {
    "id": "kowasu",
    "kanji": "壊す",
    "kana": "こわす",
    "romaji": "kowasu",
    "english": "to break / destroy",
    "indonesian": "merusak",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "壊す",
        "kana": "こわす",
        "romaji": "kowasu"
      },
      "masu": {
        "kanji": "壊します",
        "kana": "こわします",
        "romaji": "kowashimasu"
      },
      "te": {
        "kanji": "壊して",
        "kana": "こわして",
        "romaji": "kowashite"
      },
      "ta": {
        "kanji": "壊した",
        "kana": "こわした",
        "romaji": "kowashita"
      },
      "nai": {
        "kanji": "壊さない",
        "kana": "こわさない",
        "romaji": "kowasanai"
      },
      "potential": {
        "kanji": "壊せる",
        "kana": "こわせる",
        "romaji": "kowaseru"
      },
      "volitional": {
        "kanji": "壊そう",
        "kana": "こわそう",
        "romaji": "kowasou"
      },
      "imperative": {
        "kanji": "壊せ",
        "kana": "こわせ",
        "romaji": "kowase"
      },
      "prohibitive": {
        "kanji": "壊すな",
        "kana": "こわすな",
        "romaji": "kowasuna"
      },
      "passive": {
        "kanji": "壊される",
        "kana": "こわされる",
        "romaji": "kowasareru"
      },
      "causative": {
        "kanji": "壊させる",
        "kana": "こわさせる",
        "romaji": "kowasaseru"
      },
      "causativePassive": {
        "kanji": "壊ささせられる",
        "kana": "こわささせられる",
        "romaji": "kowasasaserareru"
      },
      "ba": {
        "kanji": "壊せば",
        "kana": "こわせば",
        "romaji": "kowaseba"
      }
    }
  },
  {
    "id": "mawasu",
    "kanji": "回す",
    "kana": "まわす",
    "romaji": "mawasu",
    "english": "to turn / rotate",
    "indonesian": "memutar",
    "jlpt": "N4",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "回す",
        "kana": "まわす",
        "romaji": "mawasu"
      },
      "masu": {
        "kanji": "回します",
        "kana": "まわします",
        "romaji": "mawashimasu"
      },
      "te": {
        "kanji": "回して",
        "kana": "まわして",
        "romaji": "mawashite"
      },
      "ta": {
        "kanji": "回した",
        "kana": "まわした",
        "romaji": "mawashita"
      },
      "nai": {
        "kanji": "回さない",
        "kana": "まわさない",
        "romaji": "mawasanai"
      },
      "potential": {
        "kanji": "回せる",
        "kana": "まわせる",
        "romaji": "mawaseru"
      },
      "volitional": {
        "kanji": "回そう",
        "kana": "まわそう",
        "romaji": "mawasou"
      },
      "imperative": {
        "kanji": "回せ",
        "kana": "まわせ",
        "romaji": "mawase"
      },
      "prohibitive": {
        "kanji": "回すな",
        "kana": "まわすな",
        "romaji": "mawasuna"
      },
      "passive": {
        "kanji": "回される",
        "kana": "まわされる",
        "romaji": "mawasareru"
      },
      "causative": {
        "kanji": "回させる",
        "kana": "まわさせる",
        "romaji": "mawasaseru"
      },
      "causativePassive": {
        "kanji": "回ささせられる",
        "kana": "まわささせられる",
        "romaji": "mawasasaserareru"
      },
      "ba": {
        "kanji": "回せば",
        "kana": "まわせば",
        "romaji": "mawaseba"
      }
    }
  },
  {
    "id": "suvosu",
    "kanji": "過ごす",
    "kana": "すごす",
    "romaji": "sugosu",
    "english": "to spend time",
    "indonesian": "menghabiskan waktu",
    "jlpt": "N3",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "過ごす",
        "kana": "すごす",
        "romaji": "sugosu"
      },
      "masu": {
        "kanji": "過ごします",
        "kana": "すごします",
        "romaji": "sugoshimasu"
      },
      "te": {
        "kanji": "過ごして",
        "kana": "すごして",
        "romaji": "sugoshite"
      },
      "ta": {
        "kanji": "過ごした",
        "kana": "すごした",
        "romaji": "sugoshita"
      },
      "nai": {
        "kanji": "過ごさない",
        "kana": "すごさない",
        "romaji": "sugosanai"
      },
      "potential": {
        "kanji": "過ごせる",
        "kana": "すごせる",
        "romaji": "sugoseru"
      },
      "volitional": {
        "kanji": "過ごそう",
        "kana": "すごそう",
        "romaji": "sugosou"
      },
      "imperative": {
        "kanji": "過ごせ",
        "kana": "すごせ",
        "romaji": "sugose"
      },
      "prohibitive": {
        "kanji": "過ごすな",
        "kana": "すごすな",
        "romaji": "sugosuna"
      },
      "passive": {
        "kanji": "過ごされる",
        "kana": "すごされる",
        "romaji": "sugosareru"
      },
      "causative": {
        "kanji": "過ごさせる",
        "kana": "すごさせる",
        "romaji": "sugosaseru"
      },
      "causativePassive": {
        "kanji": "過ごささせられる",
        "kana": "すごささせられる",
        "romaji": "sugosasaserareru"
      },
      "ba": {
        "kanji": "過ごせば",
        "kana": "すごせば",
        "romaji": "sugoseba"
      }
    }
  },
  {
    "id": "odakusu",
    "kanji": "脅す",
    "kana": "おどす",
    "romaji": "odosu",
    "english": "to threaten",
    "indonesian": "mengancam",
    "jlpt": "N2",
    "group": 1,
    "subGroup": "su",
    "conjugations": {
      "dictionary": {
        "kanji": "脅す",
        "kana": "おどす",
        "romaji": "odosu"
      },
      "masu": {
        "kanji": "脅します",
        "kana": "おどします",
        "romaji": "odoshimasu"
      },
      "te": {
        "kanji": "脅して",
        "kana": "おどして",
        "romaji": "odoshite"
      },
      "ta": {
        "kanji": "脅した",
        "kana": "おどした",
        "romaji": "odoshita"
      },
      "nai": {
        "kanji": "脅さない",
        "kana": "おどさない",
        "romaji": "odosanai"
      },
      "potential": {
        "kanji": "脅せる",
        "kana": "おどせる",
        "romaji": "odoseru"
      },
      "volitional": {
        "kanji": "脅そう",
        "kana": "おどそう",
        "romaji": "odosou"
      },
      "imperative": {
        "kanji": "脅せ",
        "kana": "おどせ",
        "romaji": "odose"
      },
      "prohibitive": {
        "kanji": "脅すな",
        "kana": "おどすな",
        "romaji": "odosuna"
      },
      "passive": {
        "kanji": "脅される",
        "kana": "おどされる",
        "romaji": "odosareru"
      },
      "causative": {
        "kanji": "脅させる",
        "kana": "おどさせる",
        "romaji": "odosaseru"
      },
      "causativePassive": {
        "kanji": "脅ささせられる",
        "kana": "おどささせられる",
        "romaji": "odosasaserareru"
      },
      "ba": {
        "kanji": "脅せば",
        "kana": "おどせば",
        "romaji": "odoseba"
      }
    }
  }
];
