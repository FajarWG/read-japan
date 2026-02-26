"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { parseJapaneseText } from "@/src/lib/parser";
import type { ParsedUnit, KanaInfo } from "@/src/lib/parser";
import { recordClick } from "@/src/app/actions";

// ─────────────────────────────────────────────────────────────────────────────
// KanaPopover — kartu info yang muncul di atas karakter
// ─────────────────────────────────────────────────────────────────────────────

interface KanaPopoverProps {
  info: KanaInfo;
  onStopPropagation: (e: React.MouseEvent) => void;
}

function KanaPopover({ info, onStopPropagation }: KanaPopoverProps) {
  return (
    <span
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 flex flex-col items-center pointer-events-auto"
      onClick={onStopPropagation}
    >
      {/* Card */}
      <span className="bg-gray-900 rounded-2xl shadow-2xl px-4 py-3 min-w-max flex flex-col items-center gap-1.5 text-white border border-white/10">
        {/* Romaji — pembacaan utama */}
        <span className="text-2xl font-bold tracking-widest text-indigo-300 leading-none">
          {info.romaji}
        </span>

        {/* Badge tipe: hiragana / katakana */}
        <span
          className={[
            "text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full",
            info.type === "hiragana"
              ? "bg-emerald-600/80 text-emerald-100"
              : "bg-violet-600/80 text-violet-100",
          ].join(" ")}
        >
          {info.type}
        </span>

        {/* Asal huruf (jika modifikasi) */}
        {info.origin && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <span>dari</span>
            <span className="text-yellow-300 font-bold text-base leading-none">
              {info.origin}
            </span>
          </span>
        )}

        {/* Penjelasan modifikasi */}
        {info.explanation && (
          <span className="text-[11px] text-gray-400 italic">
            {info.explanation}
          </span>
        )}
      </span>

      {/* Panah kebawah */}
      <span className="w-3 h-3 bg-gray-900 rotate-45 -mt-1.5 rounded-sm border-r border-b border-white/10" />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KanaToken — satu huruf kana yang bisa diklik
// ─────────────────────────────────────────────────────────────────────────────

interface KanaTokenProps {
  unit: ParsedUnit;
  index: number;
  isActive: boolean;
  isPendingThis: boolean;
  onToggle: (index: number, unit: ParsedUnit, e: React.MouseEvent) => void;
}

function KanaToken({
  unit,
  index,
  isActive,
  isPendingThis,
  onToggle,
}: KanaTokenProps) {
  const info = unit.info!;

  return (
    <span className="relative inline-block">
      {/* Tombol kana */}
      <button
        type="button"
        aria-expanded={isActive}
        aria-label={`${unit.char} (${info.romaji})`}
        onClick={(e) => onToggle(index, unit, e)}
        className={[
          "relative cursor-pointer select-none rounded px-0.5",
          "transition-all duration-100",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1",
          isPendingThis && "opacity-60",
          isActive
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
            : "hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 text-foreground",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {unit.char}
        {/* Garis bawah tipis sebagai indikator klikable */}
        <span className="absolute bottom-0 left-0 right-0 h-px bg-indigo-400/60 rounded" />
      </button>

      {/* Popover (hanya muncul saat aktif) */}
      {isActive && (
        <KanaPopover
          info={info}
          onStopPropagation={(e) => e.stopPropagation()}
        />
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reader — komponen utama
// ─────────────────────────────────────────────────────────────────────────────

interface ReaderProps {
  /** Teks Jepang mentah yang akan ditampilkan dan diparsing */
  storyContent: string;
}

export default function Reader({ storyContent }: ReaderProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const units = parseJapaneseText(storyContent);

  // Tutup popover saat klik di luar
  useEffect(() => {
    if (activeIndex === null) return;
    const close = () => setActiveIndex(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [activeIndex]);

  const handleToggle = useCallback(
    (index: number, unit: ParsedUnit, e: React.MouseEvent) => {
      // Cegah document listener langsung menutup popover yang baru dibuka
      e.stopPropagation();

      setActiveIndex((prev) => (prev === index ? null : index));

      // Kirim recordClick ke server di background (non-blocking)
      setPendingIndex(index);
      startTransition(async () => {
        await recordClick(unit.char);
        setPendingIndex(null);
      });
    },
    // startTransition & setPendingIndex stabil, aman untuk deps kosong
    [],
  );

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex items-center gap-3 mb-4 text-xs text-muted select-none">
        <span className="flex items-center gap-1">
          <span className="inline-block w-6 text-center border-b border-indigo-400/60 text-foreground">
            か
          </span>
          <span>= klik untuk melihat cara baca</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-600/80 text-emerald-100 text-[10px] font-bold uppercase tracking-wide">
            hiragana
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-violet-600/80 text-violet-100 text-[10px] font-bold uppercase tracking-wide">
            katakana
          </span>
        </span>
      </div>

      {/* Teks cerita */}
      <p className="text-3xl leading-14 tracking-wider font-medium overflow-visible">
        {units.map((unit, index) => {
          // Karakter non-kana: kanji, tanda baca, angka, spasi
          if (!unit.info) {
            return (
              <span key={index} className="text-foreground">
                {unit.char}
              </span>
            );
          }

          return (
            <KanaToken
              key={index}
              unit={unit}
              index={index}
              isActive={activeIndex === index}
              isPendingThis={isPending && pendingIndex === index}
              onToggle={handleToggle}
            />
          );
        })}
      </p>
    </div>
  );
}
