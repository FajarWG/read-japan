"use client";

import { useState, useEffect, useCallback } from "react";
import { getSomatomeBooks, type SomatomeBookInfo } from "@/src/modules/somatome/actions/somatomeActions";
import { BookList } from "@/src/modules/somatome/components/BookList";
import { BookWorkspace } from "@/src/modules/somatome/components/BookWorkspace";

export function SomatomeContent() {
  const [books, setBooks] = useState<SomatomeBookInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const loadBooks = useCallback(async () => {
    const rows = await getSomatomeBooks();
    setBooks(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  if (loading) {
    return <p className="text-xs text-muted text-center py-16">Memuat...</p>;
  }

  const selectedBook = books.find((b) => b.id === selectedBookId);

  if (selectedBook) {
    return (
      <BookWorkspace
        book={selectedBook}
        onBack={() => setSelectedBookId(null)}
        onBookUpdated={loadBooks}
      />
    );
  }

  return (
    <BookList books={books} onSelect={setSelectedBookId} onCreated={loadBooks} />
  );
}
