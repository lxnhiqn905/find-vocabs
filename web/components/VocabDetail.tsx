"use client";

import { useState } from "react";
import { VocabItem } from "@/types/dictionary";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

const PART_OF_SPEECH_COLORS: Record<string, string> = {
  noun: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  verb: "text-green-400 bg-green-400/10 border-green-400/20",
  adjective: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  adverb: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  exclamation: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

function posColor(pos: string) {
  return PART_OF_SPEECH_COLORS[pos.toLowerCase()] ?? "text-slate-400 bg-slate-400/10 border-slate-400/20";
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

  return (
    <div className="glass-card p-6 animate-slide-in">
      {/* Word + phonetic */}
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
        {item.phonetic && (
          <p className="text-purple-300 text-lg font-mono">{item.phonetic}</p>
        )}

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

      {/* Meanings */}
      <div className="space-y-6">
        {item.meanings.map((meaning, mi) => (
          <div key={mi}>
            {/* Part of speech badge */}
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 ${posColor(meaning.partOfSpeech)}`}>
              {meaning.partOfSpeech}
            </span>

            <ol className="space-y-3">
              {meaning.definitions.map((def, di) => (
                <li key={di} className="flex gap-3">
                  <span className="text-purple-400 font-bold text-sm mt-0.5 shrink-0">
                    {di + 1}.
                  </span>
                  <div>
                    <p className="text-slate-200 text-sm leading-relaxed">{def.definition}</p>
                    {def.example && (
                      <p className="text-slate-500 text-sm italic mt-1">
                        &quot;{def.example}&quot;
                      </p>
                    )}
                    {def.synonyms && def.synonyms.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {def.synonyms.slice(0, 5).map((s) => (
                          <span key={s} className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
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
