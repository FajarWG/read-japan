"use client";

import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { HandwritingCanvas } from "./HandwritingCanvas";

interface HandwritingPracticeWidgetProps {
  expected: string;
  label?: string; // e.g. "Target Sentence" or "Target Conjugation"
  onClose?: () => void;
  className?: string;
}

export function HandwritingPracticeWidget({
  expected,
  label,
  onClose,
  className = ""
}: HandwritingPracticeWidgetProps) {
  const [writtenText, setWrittenText] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const getCleanJapanese = (str: string) => {
    return str.replace(/\s*[\(（].*?[\)）]/g, "").trim();
  };

  const targetClean = getCleanJapanese(expected);
  
  // Default label: check if expected looks like a sentence (has a Japanese full stop or is long)
  const defaultLabel = label || (
    targetClean.includes("。") || targetClean.length > 6
      ? "Target Sentence:"
      : "Target Conjugation:"
  );

  const handleCheck = () => {
    const writtenClean = getCleanJapanese(writtenText);
    const correct = writtenClean === targetClean;
    setIsCorrect(correct);
    setIsChecked(true);
  };

  const handleRetry = () => {
    setWrittenText("");
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className={`flex flex-col gap-3 p-4 bg-surface border border-border/65 rounded-2xl shadow-sm w-full ${className}`}>
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider select-none">
          Practice Writing
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-surface-muted rounded-lg text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs font-bold px-1 select-none">
        <span className="text-muted">{defaultLabel}</span>
        <span className="font-jp text-sm text-accent font-black">{targetClean}</span>
      </div>

      {isChecked ? (
        <div className="flex flex-col gap-3 p-3 rounded-xl border border-border/40 bg-surface-muted/40 animate-enter">
          <div className="flex items-start gap-2.5">
            {isCorrect ? (
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 shrink-0 select-none">
                <CheckCircle className="w-4 h-4 fill-emerald-500/10" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 shrink-0 select-none">
                <X className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <h4 className={`text-xs font-black uppercase tracking-wider ${isCorrect ? "text-emerald-500" : "text-red-500"}`}>
                {isCorrect ? "Excellent Accuracy!" : "Not Quite Correct"}
              </h4>
              <p className="text-xs text-muted leading-relaxed font-semibold">
                {isCorrect
                  ? "You wrote it correctly."
                  : `Target: "${targetClean}". You wrote: "${getCleanJapanese(writtenText)}"`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="w-full text-xs font-bold py-2 bg-foreground text-background rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <HandwritingCanvas
            value={writtenText}
            onChange={setWrittenText}
            onSubmit={handleCheck}
            placeholder="Draw here..."
            hintText={targetClean}
          />
          <button
            type="button"
            onClick={handleCheck}
            disabled={!writtenText.trim()}
            className="w-full text-xs font-extrabold py-2.5 bg-accent hover:bg-accent/90 active:scale-95 text-white rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-3xs"
          >
            Check Accuracy
          </button>
        </div>
      )}
    </div>
  );
}
