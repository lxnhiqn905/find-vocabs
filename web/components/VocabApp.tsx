"use client";

import { useState, useRef } from "react";
import { lookupWord } from "@/lib/dictionary";
import { VocabItem } from "@/types/dictionary";
import SearchBar from "./SearchBar";
import VocabCard from "./VocabCard";
import VocabDetail from "./VocabDetail";

export default function VocabApp() {
  const [vocabs, setVocabs] = useState<VocabItem[]>([]);
  const [selected, setSelected] = useState<VocabItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastWordRef = useRef("");

  async function handleSearch(word: string) {
    const clean = word.trim().toLowerCase();
    if (!clean) return;

    setLoading(true);
    setError("");
    lastWordRef.current = clean;

    try {
      const item = await lookupWord(clean);

      setVocabs((prev) => {
        const idx = prev.findIndex((v) => v.word === item.word);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = item;
          return updated;
        }
        return [item, ...prev];
      });

      setSelected(item);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch definition");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-[#0a0e1a]/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/25">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <span className="text-lg font-bold gradient-text">Find Vocabs</span>
          </div>
          {vocabs.length > 0 && (
            <span className="text-sm text-slate-400">
              {vocabs.length} word{vocabs.length !== 1 ? "s" : ""} saved
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            <span className="gradient-text">Look up any word</span>
          </h1>
          <p className="text-slate-400 text-center text-sm mb-6">
            Type a word to find its definition, phonetics, and examples
          </p>
          <SearchBar onSearch={handleSearch} loading={loading} />
          {error && (
            <p className="mt-3 text-center text-red-400 text-sm">{error}</p>
          )}
        </div>

        {/* Layout: detail + list */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Detail panel */}
          <div className="lg:flex-1">
            {selected ? (
              <VocabDetail key={selected.word} item={selected} />
            ) : (
              <div className="glass-card p-10 flex flex-col items-center justify-center text-center min-h-[280px]">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">
                  Search for a word to see its definition here
                </p>
              </div>
            )}
          </div>

          {/* Vocab list */}
          {vocabs.length > 0 && (
            <div className="lg:w-72 xl:w-80">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Vocab List ({vocabs.length})
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {vocabs.map((item) => (
                  <VocabCard
                    key={item.word}
                    item={item}
                    isSelected={selected?.word === item.word}
                    onClick={() => setSelected(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
