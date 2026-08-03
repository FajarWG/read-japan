"use client";

import { useState, useEffect, useMemo } from "react";
import { Button, Input } from "@heroui/react";
import {
  ArrowLeft,
  Pencil,
  ExternalLink,
  Headphones,
  History,
  ListChecks,
  Clipboard,
  RotateCcw,
} from "lucide-react";
import { updateSomatomeBook, type SomatomeBookInfo } from "@/src/modules/somatome/actions/somatomeActions";
import { QuizSession } from "@/src/modules/somatome/components/QuizSession";
import { HistoryPanel } from "@/src/modules/somatome/components/HistoryPanel";

function driveFileId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

function driveAudioEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (folderMatch?.[1]) {
    return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#list`;
  }
  const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }
  return url;
}

export function BookWorkspace({
  book,
  onBack,
  onBookUpdated,
}: {
  book: SomatomeBookInfo;
  onBack: () => void;
  onBookUpdated: () => void;
}) {
  const [tab, setTab] = useState<"latihan" | "riwayat" | "audio">("latihan");
  const [editingLink, setEditingLink] = useState<"pdf" | "audio" | null>(null);
  const [linkDraft, setLinkDraft] = useState("");
  const [activeTrackInput, setActiveTrackInput] = useState("");

  const fileId = useMemo(() => driveFileId(book.pdfUrl), [book.pdfUrl]);

  const embedUrl = useMemo(() => {
    if (!fileId && !book.pdfUrl) return null;
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return book.pdfUrl;
  }, [fileId, book.pdfUrl]);

  const currentAudioEmbed = useMemo(() => {
    if (activeTrackInput.trim()) {
      return driveAudioEmbedUrl(activeTrackInput.trim());
    }
    return driveAudioEmbedUrl(book.audioUrl);
  }, [activeTrackInput, book.audioUrl]);

  async function handlePasteTrack() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setActiveTrackInput(text.trim());
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  }

  function openEditLink(kind: "pdf" | "audio") {
    setEditingLink(kind);
    setLinkDraft((kind === "pdf" ? book.pdfUrl : book.audioUrl) ?? "");
  }

  async function handleSaveLink() {
    if (!editingLink) return;
    const field = editingLink === "pdf" ? "pdfUrl" : "audioUrl";
    await updateSomatomeBook(book.id, { [field]: linkDraft.trim() || null });
    setEditingLink(null);
    setLinkDraft("");
    onBookUpdated();
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto animate-page-enter">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <button type="button" onClick={onBack} className="text-muted hover:text-foreground cursor-pointer shrink-0">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-jp text-base font-bold text-foreground truncate">{book.name}</h1>
        </div>

        <div className="flex gap-1.5 rounded-xl border border-border bg-surface p-1 shrink-0">
          <button
            type="button"
            onClick={() => setTab("latihan")}
            className={[
              "text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
              tab === "latihan" ? "bg-indigo-600 text-white" : "text-muted hover:text-foreground",
            ].join(" ")}
          >
            <ListChecks size={13} /> Practice Quiz
          </button>
          <button
            type="button"
            onClick={() => setTab("riwayat")}
            className={[
              "text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
              tab === "riwayat" ? "bg-indigo-600 text-white" : "text-muted hover:text-foreground",
            ].join(" ")}
          >
            <History size={13} /> History
          </button>
          <button
            type="button"
            onClick={() => setTab("audio")}
            className={[
              "text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
              tab === "audio" ? "bg-indigo-600 text-white" : "text-muted hover:text-foreground",
            ].join(" ")}
          >
            <Headphones size={13} /> Audio CD
          </button>
        </div>
      </div>

      {/* Grid ratio 70:30 (col-span-7 vs col-span-3) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Left: PDF viewer (70% width, tall 85vh container) */}
        <div className="lg:col-span-7 flex flex-col gap-2">
          <div className="rounded-xl border border-border bg-surface-muted/20 overflow-hidden h-[85vh] min-h-[750px] flex-1">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full min-h-[750px]"
                allow="autoplay"
              />
            ) : (
              <div className="w-full h-full min-h-[400px] flex items-center justify-center p-6 text-center">
                <p className="text-xs text-muted">Invalid PDF link. Please check the Google Drive link.</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2">
            <div className="flex items-center gap-2 text-xs">
              <Headphones size={14} className="text-indigo-500" />
              {book.audioUrl ? (
                <a
                  href={book.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  Open Audio CD in Drive <ExternalLink size={11} />
                </a>
              ) : (
                <span className="text-muted">No CD audio link attached</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => openEditLink("audio")}
              className="text-muted hover:text-foreground cursor-pointer"
              title="Edit audio link"
            >
              <Pencil size={13} />
            </button>
          </div>

          {editingLink === "audio" && (
            <div className="flex gap-2 rounded-xl border border-border bg-surface p-2.5">
              <Input
                value={linkDraft}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkDraft(e.target.value)}
                placeholder="Paste Google Drive Audio/CD folder link..."
                className="flex-1 text-xs"
              />
              <Button size="sm" variant="primary" onClick={handleSaveLink} className="cursor-pointer">
                Save
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setEditingLink(null)} className="cursor-pointer">
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Right: quiz, history or audio cd (30% width) */}
        <div className="lg:col-span-3 flex flex-col gap-3 min-w-0">
          {tab === "latihan" && <QuizSession bookId={book.id} />}
          {tab === "riwayat" && <HistoryPanel bookId={book.id} />}
          {tab === "audio" && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Headphones size={14} className="text-indigo-500" />
                    <span className="font-bold text-foreground">Audio CD Tracks</span>
                  </div>
                  {book.audioUrl && (
                    <a
                      href={book.audioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-indigo-500 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Open Drive <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                {/* Track Player Input */}
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[10px] font-semibold text-muted">Play Specific Track (Paste Drive File Link/ID):</span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={activeTrackInput}
                      onChange={(e) => setActiveTrackInput(e.target.value)}
                      placeholder="Paste track file link, e.g. drive.google.com/file/d/..."
                      className="flex-1 text-xs bg-background border border-border rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                    />
                    {activeTrackInput ? (
                      <button
                        type="button"
                        onClick={() => setActiveTrackInput("")}
                        className="text-xs font-semibold text-muted hover:text-foreground px-2.5 py-1 rounded-lg border border-border bg-surface-muted/30 cursor-pointer flex items-center gap-1 transition-colors shrink-0"
                        title="Clear track link"
                      >
                        <RotateCcw size={12} /> Reset
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handlePasteTrack}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/5 cursor-pointer flex items-center gap-1 transition-colors shrink-0"
                        title="Paste link from clipboard"
                      >
                        <Clipboard size={12} /> Paste
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface-muted/20 overflow-hidden h-[65vh] min-h-[500px]">
                {currentAudioEmbed ? (
                  <iframe
                    key={`audio-frame-${currentAudioEmbed}`}
                    src={currentAudioEmbed}
                    className="w-full h-full min-h-[500px]"
                    allow="autoplay"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-2">
                    <Headphones size={32} className="text-muted opacity-40" />
                    <p className="text-xs text-muted">No Google Drive Audio CD link attached to this book yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}





