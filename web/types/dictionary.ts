export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: { text?: string; audio?: string }[];
  meanings: Meaning[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
}

export interface VocabItem {
  word: string;
  phonetic: string;
  meanings: Meaning[];
  addedAt: number;
}
