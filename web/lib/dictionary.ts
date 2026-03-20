import { VocabItem } from "@/types/dictionary";

export async function lookupWord(word: string): Promise<VocabItem> {
  const res = await fetch(`/api/lookup?word=${encodeURIComponent(word.trim().toLowerCase())}`);

  if (!res.ok) {
    throw new Error(`Word not found: "${word}"`);
  }

  const data = await res.json();
  if (!data || !data.results?.length) {
    throw new Error(`No definition found for "${word}"`);
  }

  return {
    word: data.word,
    phonetic: data.pronunciation?.all ?? "",
    syllables: data.syllables,
    frequency: data.frequency,
    results: data.results,
    addedAt: Date.now(),
  };
}
