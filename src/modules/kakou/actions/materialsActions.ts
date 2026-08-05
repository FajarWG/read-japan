"use server";

import { getKatsuyouStats } from "@/src/modules/katsuyou/actions/katsuyouActions";
import { getBunpouProgress } from "@/src/modules/bunpou/actions/bunpouActions";
import { CONJUGATION_FORMS } from "@/src/modules/katsuyou/data/conjugationForms";
import { BUNPOU_DATA } from "@/src/modules/bunpou/data/bunpouData";
import type { KakouMaterials } from "@/src/modules/kakou/data/types";

export async function getKakouMaterials(): Promise<KakouMaterials> {
  const [katsuyouStats, bunpouCompletedIds] = await Promise.all([
    getKatsuyouStats(),
    getBunpouProgress(),
  ]);

  return {
    katsuyou: {
      forms: CONJUGATION_FORMS,
      completedLessons: katsuyouStats.completedLessons,
      dueReviewsByForm: katsuyouStats.dueReviewsByForm,
    },
    bunpou: {
      lessons: BUNPOU_DATA,
      completedPatternIds: bunpouCompletedIds,
    },
  };
}
