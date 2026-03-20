"use client";

import { useState, FormEvent } from "react";

interface Props {
  onSearch: (word: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a word (e.g. serendipity)"
        className="flex-1 bg-[#0f1629] border border-purple-900/40 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 text-base transition-all focus:border-purple-500/60"
        disabled={loading}
        autoFocus
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="px-5 py-3 rounded-xl font-semibold text-white transition-all
          bg-gradient-to-r from-purple-600 to-blue-600
          hover:from-purple-500 hover:to-blue-500
          disabled:opacity-40 disabled:cursor-not-allowed
          shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40
          flex items-center gap-2"
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
        )}
        Look up
      </button>
    </form>
  );
}
