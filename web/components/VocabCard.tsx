"use client";

import { VocabItem } from "@/types/dictionary";

interface Props {
  item: VocabItem;
  isSelected: boolean;
  onClick: () => void;
}

export default function VocabCard({ item, isSelected, onClick }: Props) {
  const firstResult = item.results[0];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl px-4 py-3 border transition-all duration-150 ${
        isSelected
          ? "bg-purple-500/15 border-purple-500/40 shadow-lg shadow-purple-500/10"
          : "bg-[#0f1629]/60 border-purple-900/30 hover:bg-purple-500/5 hover:border-purple-500/20"
      }`}
    >
      <div className="flex items-baseline gap-2 mb-0.5">
        <span className="font-semibold text-white text-sm">{item.word}</span>
        {item.phonetic && (
          <span className="text-xs text-purple-300 font-mono">{item.phonetic}</span>
        )}
      </div>
      {firstResult?.partOfSpeech && (
        <span className="text-xs text-purple-400 italic">{firstResult.partOfSpeech}</span>
      )}
      {firstResult?.definition && (
        <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
          {firstResult.definition}
        </p>
      )}
    </button>
  );
}
