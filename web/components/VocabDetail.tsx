"use client";

import { VocabItem } from "@/types/dictionary";

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
  return (
    <div className="glass-card p-6 animate-slide-in">
      {/* Word + phonetic */}
      <div className="mb-5">
        <h2 className="text-4xl font-bold text-white mb-1">{item.word}</h2>
        {item.phonetic && (
          <p className="text-purple-300 text-lg font-mono">{item.phonetic}</p>
        )}
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
              {meaning.definitions.slice(0, 4).map((def, di) => (
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
