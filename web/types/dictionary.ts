export interface WordResult {
  definition: string;
  partOfSpeech: string;
  synonyms?: string[];
  antonyms?: string[];
  typeOf?: string[];
  hasTypes?: string[];
  examples?: string[];
  derivation?: string[];
}

export interface VocabItem {
  word: string;
  phonetic: string;
  syllables?: { count: number; list: string[] };
  frequency?: number;
  results: WordResult[];
  addedAt: number;
}
