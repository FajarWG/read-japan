/**
 * Gemini API rate limiter + client.
 *
 * Dua model yang dipakai (sesuai jawaban user):
 * - gemini-3.1-flash-lite: hemat RPD (15 RPM, 500 RPD). Default.
 * - gemini-2.5-flash-lite: lebih banyak RPM (10 RPM, 20 RPD, 250K token).
 *   Fallback jika Lite quota tercapai.
 *
 * Quota disimpan di memory + persist ke DB (ActivityLog metadata
 * field) untuk visibilitas. Reset harian otomatis.
 *
 * Tier sistem:
 * - User-level: opsional, untuk track per-user abuse. Default global.
 * - Global: shared limit untuk semua user.
 */

import { prisma } from "@/src/shared/lib/db";

// ─────────────────────────────────────────
// Tier configs (sesuai jawaban user)
// ─────────────────────────────────────────

export type GeminiModel =
  | "gemini-3.1-flash-lite"
  | "gemini-2.5-flash-lite"
  | "gemini-3.5-flash";

interface TierConfig {
  model: GeminiModel;
  endpoint: string;
  rpm: number; // requests per minute
  rpd: number; // requests per day
  /** Batas token per hari (jika ada). */
  tpd?: number;
}

const TIERS: Record<GeminiModel, TierConfig> = {
  "gemini-3.5-flash": {
    model: "gemini-3.5-flash",
    endpoint:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
    rpm: 15,
    rpd: 100,
  },
  "gemini-3.1-flash-lite": {
    model: "gemini-3.1-flash-lite",
    endpoint:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",
    rpm: 15,
    rpd: 500,
  },
  "gemini-2.5-flash-lite": {
    model: "gemini-2.5-flash-lite",
    endpoint:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
    rpm: 10,
    rpd: 20,
    tpd: 250_000,
  },
};

// ─────────────────────────────────────────
// In-memory counters (cleared on restart)
// ─────────────────────────────────────────

interface ModelCounter {
  lastResetDate: string; // YYYY-MM-DD UTC
  lastResetMinute: number; // minute epoch ms
  rpm: { count: number; resetAt: number }; // reset every minute
  rpd: { count: number };
}

const counters: Record<GeminiModel, ModelCounter> = {
  "gemini-3.5-flash": createCounter(),
  "gemini-3.1-flash-lite": createCounter(),
  "gemini-2.5-flash-lite": createCounter(),
};

function createCounter(): ModelCounter {
  const now = new Date();
  return {
    lastResetDate: todayKey(now),
    lastResetMinute: Date.now(),
    rpm: { count: 0, resetAt: Date.now() + 60_000 },
    rpd: { count: 0 },
  };
}

function todayKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function maybeResetCounter(model: GeminiModel) {
  const c = counters[model];
  const today = todayKey(new Date());
  if (c.lastResetDate !== today) {
    c.lastResetDate = today;
    c.rpd.count = 0;
  }
  if (Date.now() >= c.rpm.resetAt) {
    c.rpm.count = 0;
    c.rpm.resetAt = Date.now() + 60_000;
  }
}

// ─────────────────────────────────────────
// Public API
// ─────────────────────────────────────────

export interface QuotaStatus {
  model: GeminiModel;
  rpm: { used: number; limit: number };
  rpd: { used: number; limit: number };
  remaining: { rpm: number; rpd: number };
}

export function getQuotaStatus(): QuotaStatus[] {
  const out: QuotaStatus[] = [];
  for (const m of Object.keys(TIERS) as GeminiModel[]) {
    maybeResetCounter(m);
    const t = TIERS[m];
    const c = counters[m];
    out.push({
      model: m,
      rpm: { used: c.rpm.count, limit: t.rpm },
      rpd: { used: c.rpd.count, limit: t.rpd },
      remaining: {
        rpm: Math.max(0, t.rpm - c.rpm.count),
        rpd: Math.max(0, t.rpd - c.rpd.count),
      },
    });
  }
  return out;
}

export class RateLimitError extends Error {
  constructor(
    public readonly model: GeminiModel,
    public readonly kind: "rpm" | "rpd",
  ) {
    super(`Rate limit exceeded for ${model} (${kind})`);
  }
}

export class AllModelsExhaustedError extends Error {
  constructor() {
    super("All Gemini models exhausted for now. Try again later.");
  }
}

/**
 * Pilih model yang available. Default ke Lite; fallback ke 2.5 Lite.
 */
export function pickAvailableModel(): GeminiModel {
  for (const m of [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
  ] as GeminiModel[]) {
    maybeResetCounter(m);
    const t = TIERS[m];
    const c = counters[m];
    if (c.rpm.count < t.rpm && c.rpd.count < t.rpd) {
      return m;
    }
  }
  throw new AllModelsExhaustedError();
}

/**
 * Acquire a request slot for the given model. Throws jika exceeded.
 */
function acquireSlot(model: GeminiModel) {
  maybeResetCounter(model);
  const t = TIERS[model];
  const c = counters[model];
  if (c.rpm.count >= t.rpm) throw new RateLimitError(model, "rpm");
  if (c.rpd.count >= t.rpd) throw new RateLimitError(model, "rpd");
  c.rpm.count += 1;
  c.rpd.count += 1;
}

// ─────────────────────────────────────────
// Gemini API call
// ─────────────────────────────────────────

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.warn("[gemini-limiter] GEMINI_API_KEY not set — chat will fail");
}

export interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

export interface GeminiResponse {
  text: string;
  model: GeminiModel;
  tokens?: number;
}

/**
 * Call Gemini dengan system prompt + history + new user message.
 * Otomatis pilih model & acquire slot. Throws pada rate limit.
 */
export async function callGemini(
  systemPrompt: string,
  history: GeminiMessage[],
  userMessage: string,
  preferredModel?: GeminiModel,
): Promise<GeminiResponse> {
  const model = preferredModel ?? pickAvailableModel();
  acquireSlot(model);

  const tier = TIERS[model];
  const contents: GeminiMessage[] = [
    { role: "user", parts: [{ text: systemPrompt }] },
    {
      role: "model",
      parts: [
        {
          text: "Understood. I'll help with Japanese learning at the appropriate level.",
        },
      ],
    },
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const res = await fetch(`${tier.endpoint}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        topP: 0.9,
      },
    }),
  });

  if (!res.ok) {
    // Refund slot kalau API error (server side)
    counters[model].rpm.count = Math.max(0, counters[model].rpm.count - 1);
    counters[model].rpd.count = Math.max(0, counters[model].rpd.count - 1);
    const errText = await res.text();
    throw new Error(`Gemini ${model} ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    usageMetadata?: { totalTokenCount?: number };
  };

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? "(no response)";
  const tokens = data.usageMetadata?.totalTokenCount;
  return { text, model, tokens };
}

/**
 * Log usage ke ActivityLog untuk visibility.
 */
export async function logChatUsage(
  userId: number,
  model: GeminiModel,
  tokens?: number,
): Promise<void> {
  await prisma.activityLog.create({
    data: {
      userId,
      type: "chat_message",
      metadata: {
        model,
        tokens: tokens ?? null,
      },
    },
  });
}
