"use client";

import { useState } from "react";
import { VocabItem } from "@/types/dictionary";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

const POS_COLORS: Record<string, string> = {
  noun: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  verb: "text-green-400 bg-green-400/10 border-green-400/20",
  adjective: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  adverb: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  exclamation: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

function posColor(pos: string) {
  return POS_COLORS[pos?.toLowerCase()] ?? "text-slate-400 bg-slate-400/10 border-slate-400/20";
}

function Pills({ label, items, color }: { label: string; items: string[]; color: string }) {
  if (!items?.length) return null;
  return (
    <div className="mt-2">
      <span className="text-xs text-slate-500 mr-1.5">{label}:</span>
      <span className="inline-flex flex-wrap gap-1">
        {items.slice(0, 6).map((s) => (
          <span key={s} className={`text-xs px-2 py-0.5 rounded-full border ${color}`}>{s}</span>
        ))}
      </span>
    </div>
  );
}

interface Props {
  item: VocabItem;
}

export default function VocabDetail({ item }: Props) {
  const { isSpeaking, isSupported, speak, stop } = useSpeechSynthesis();
  const [viTranslation, setViTranslation] = useState<string | null>(null);
  const [viExpanded, setViExpanded] = useState(false);
  const [viLoading, setViLoading] = useState(false);

  const handleListen = () => {
    if (isSpeaking) stop();
    else speak(item.word);
  };

  const handleToggleVi = async () => {
    if (!viExpanded && viTranslation === null) {
      setViLoading(true);
      try {
        const res = await fetch(`https://lingva.ml/api/v1/auto/vi/${encodeURIComponent(item.word)}`);
        const data = await res.json();
        setViTranslation(data.translation ?? null);
      } catch {
        setViTranslation(null);
      } finally {
        setViLoading(false);
      }
    }
    setViExpanded((v) => !v);
  };

  // Group results by partOfSpeech
  const grouped = item.results.reduce<Record<string, typeof item.results>>((acc, r) => {
    const pos = r.partOfSpeech ?? "other";
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(r);
    return acc;
  }, {});

  return (
    <div className="glass-card p-6 animate-slide-in">
      {/* Word + phonetic + meta */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-4xl font-bold text-white">{item.word}</h2>
          {isSupported && (
            <button
              onClick={handleListen}
              title={isSpeaking ? "Stop" : "Listen"}
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
                isSpeaking
                  ? "bg-purple-500/30 border-purple-400 text-purple-300"
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-purple-400 hover:text-purple-300"
              }`}
            >
              {isSpeaking ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Phonetic + syllables */}
        <div className="flex items-center gap-3 flex-wrap">
          {item.phonetic && (
            <p className="text-purple-300 text-lg font-mono">{item.phonetic}</p>
          )}
          {item.syllables && (
            <p className="text-slate-500 text-sm">{item.syllables.list.join(" · ")}</p>
          )}
          {item.frequency != null && (
            <span className="text-xs text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">
              freq {item.frequency.toFixed(1)}
            </span>
          )}
        </div>

        {/* Vietnamese translation toggle */}
        <button
          onClick={handleToggleVi}
          className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 hover:text-purple-300 transition-colors"
        >
          <span className="px-1.5 py-0.5 rounded border border-slate-600 text-slate-400 font-semibold text-[10px]">VI</span>
          {viLoading ? (
            <span>Đang dịch...</span>
          ) : viExpanded && viTranslation ? (
            <span className="text-purple-300 font-medium">{viTranslation}</span>
          ) : (
            <span>Xem tiếng Việt</span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 transition-transform ${viExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className="w-full h-px bg-purple-900/30 mb-5" />

      {/* Definitions grouped by part of speech */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([pos, results]) => (
          <div key={pos}>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 ${posColor(pos)}`}>
              {pos}
            </span>

            <ol className="space-y-4">
              {results.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-purple-400 font-bold text-sm mt-0.5 shrink-0">{i + 1}.</span>
                  <div className="flex-1">
                    <p className="text-slate-200 text-sm leading-relaxed">{r.definition}</p>
                    {r.examples?.map((ex, ei) => (
                      <p key={ei} className="text-slate-500 text-sm italic mt-1">&quot;{ex}&quot;</p>
                    ))}
                    <Pills label="synonyms" items={r.synonyms ?? []} color="bg-purple-500/10 text-purple-300 border-purple-500/20" />
                    <Pills label="type of" items={r.typeOf ?? []} color="bg-blue-500/10 text-blue-300 border-blue-500/20" />
                    <Pills label="has types" items={r.hasTypes ?? []} color="bg-slate-500/10 text-slate-400 border-slate-500/20" />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
