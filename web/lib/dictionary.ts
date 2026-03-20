import { DictionaryEntry } from "@/types/dictionary";

export async function lookupWord(word: string): Promise<DictionaryEntry> {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim().toLowerCase())}`
  );

  if (!res.ok) {
    throw new Error(`Word not found: "${word}"`);
  }

  const data: DictionaryEntry[] = await res.json();
  if (!data || data.length === 0) {
    throw new Error(`No definition found for "${word}"`);
  }

  return data[0];
}
