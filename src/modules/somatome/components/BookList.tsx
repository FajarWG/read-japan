"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import {
  createSomatomeBook,
  updateSomatomeBook,
  deleteSomatomeBook,
  type SomatomeBookInfo,
} from "@/src/modules/somatome/actions/somatomeActions";

interface BookListProps {
  books: SomatomeBookInfo[];
  onSelect: (bookId: number) => void;
  onCreated: () => void;
}

export function BookList({ books, onSelect, onCreated }: BookListProps) {
  const [adding, setAdding] = useState(false);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const [editName, setEditName] = useState("");
  const [editPdfUrl, setEditPdfUrl] = useState("");
  const [editAudioUrl, setEditAudioUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setError(null);
    if (!name.trim() || !pdfUrl.trim()) {
      setError("Book name and PDF link are required.");
      return;
    }
    setSaving(true);
    const result = await createSomatomeBook(name, pdfUrl, audioUrl || undefined);
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Failed to add book");
      return;
    }
    setName("");
    setPdfUrl("");
    setAudioUrl("");
    setAdding(false);
    onCreated();
  }

  function startEdit(b: SomatomeBookInfo, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingBookId(b.id);
    setEditName(b.name);
    setEditPdfUrl(b.pdfUrl);
    setEditAudioUrl(b.audioUrl ?? "");
    setError(null);
  }

  async function handleUpdateBook() {
    if (!editingBookId) return;
    if (!editName.trim() || !editPdfUrl.trim()) {
      setError("Book name and PDF link are required.");
      return;
    }
    setSaving(true);
    const result = await updateSomatomeBook(editingBookId, {
      name: editName.trim(),
      pdfUrl: editPdfUrl.trim(),
      audioUrl: editAudioUrl.trim() || null,
    });
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Failed to update book");
      return;
    }
    setEditingBookId(null);
    onCreated();
  }

  async function handleDeleteBook(id: number) {
    if (!confirm("Are you sure you want to delete this book?")) return;
    setSaving(true);
    await deleteSomatomeBook(id);
    setSaving(false);
    setEditingBookId(null);
    onCreated();
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto animate-page-enter">
      <div>
        <h1 className="font-jp text-lg font-bold text-foreground">まとめ Somatome</h1>
        <p className="text-xs text-muted mt-0.5">
          Select a book to study, or add a new book via Google Drive link.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => onSelect(book.id)}
            className="flex items-center justify-between gap-2 p-4 rounded-2xl border border-border bg-surface hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex flex-col gap-1 text-left min-w-0">
              <div className="flex items-center gap-2 text-indigo-500">
                <BookOpen size={18} className="shrink-0" />
                <span className="font-bold text-sm text-foreground truncate">{book.name}</span>
              </div>
              <p className="text-[11px] text-muted">
                {book.audioUrl ? "PDF + Audio CD" : "PDF"}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => startEdit(book, e)}
              className="p-2 rounded-xl border border-border hover:bg-surface-muted/60 text-muted hover:text-foreground cursor-pointer transition-colors opacity-80 group-hover:opacity-100 shrink-0"
              title="Edit book details"
            >
              <Pencil size={14} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            setAdding(true);
            setEditingBookId(null);
          }}
          className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl border-2 border-dashed border-border hover:border-indigo-500 text-muted hover:text-indigo-500 transition-all cursor-pointer min-h-24"
        >
          <Plus size={18} />
          <span className="text-xs font-semibold">Add Book</span>
        </button>
      </div>

      {/* Edit Book Modal/Card */}
      {editingBookId && (
        <div className="flex flex-col gap-2.5 rounded-2xl border border-indigo-500/30 bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Edit Book Details</span>
            <button
              type="button"
              onClick={() => handleDeleteBook(editingBookId)}
              className="text-xs text-red-500 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Trash2 size={13} /> Delete Book
            </button>
          </div>

          <Input
            value={editName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
            placeholder="Book name"
            className="text-sm"
          />
          <Input
            value={editPdfUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditPdfUrl(e.target.value)}
            placeholder="Public Google Drive PDF link"
            className="text-sm"
          />
          <Input
            value={editAudioUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditAudioUrl(e.target.value)}
            placeholder="Google Drive Audio/CD folder link (optional)"
            className="text-sm"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="secondary" onClick={() => setEditingBookId(null)} className="cursor-pointer">
              Cancel
            </Button>
            <Button size="sm" variant="primary" onClick={handleUpdateBook} isDisabled={saving} className="cursor-pointer">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}

      {/* Add Book Modal/Card */}
      {adding && (
        <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-surface p-4">
          <span className="text-xs font-bold text-foreground">New Book</span>
          <Input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="Book name, e.g. Somatome N4 - Kanji Vocabulary"
            className="text-sm"
          />
          <Input
            value={pdfUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPdfUrl(e.target.value)}
            placeholder="Public Google Drive PDF link"
            className="text-sm"
          />
          <Input
            value={audioUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAudioUrl(e.target.value)}
            placeholder="Google Drive Audio/CD folder link (optional)"
            className="text-sm"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="secondary" onClick={() => setAdding(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button size="sm" variant="primary" onClick={handleCreate} isDisabled={saving} className="cursor-pointer">
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}




