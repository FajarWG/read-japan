"use client";

export function AnswerPicker({
  value,
  onChange,
  variant,
  disabled,
}: {
  value: number | null | undefined;
  onChange: (v: number) => void;
  variant: "key" | "mine";
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4].map((n) => {
        const selected = value === n;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(n)}
            className={[
              "w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg border-2 transition-all cursor-pointer select-none",
              selected
                ? variant === "key"
                  ? "bg-amber-500 border-amber-500 text-white"
                  : "bg-indigo-600 border-indigo-600 text-white"
                : "border-border bg-background text-muted hover:border-indigo-400",
              disabled ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
