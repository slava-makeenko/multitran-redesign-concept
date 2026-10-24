export type PairId = 'en-ru' | 'ru-en';

export type SubjectId =
  | 'general'
  | 'aviation'
  | 'military'
  | 'engineering'
  | 'medicine'
  | 'golf'
  | 'math'
  | 'law'
  | 'economics'
  | 'logistics';

export type PosId = 'noun' | 'verb';

export interface Translation {
  text: string;
  /** Пояснение к переводу: в каком смысле, с чем сочетается */
  gloss?: string;
  example?: { source: string; target: string };
  /** Ник автора перевода — в концепте вымышленный */
  author?: string;
}

export interface SubjectGroup {
  subject: SubjectId;
  items: Translation[];
}

export interface Sense {
  text: string;
  gloss?: string;
}

export interface PartOfSpeech {
  id: PosId;
  mainSenses: Sense[];
  groups: SubjectGroup[];
}

export interface Phrase {
  source: string;
  target: string;
}

export interface ForumTopic {
  title: string;
  replies: number;
}

export interface Entry {
  /** Часть адреса: /en-ru/approach/ */
  slug: string;
  pair: PairId;
  word: string;
  ipa?: string;
  parts: PartOfSpeech[];
  phrases: Phrase[];
  forum: ForumTopic[];
}
