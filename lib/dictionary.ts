import { approach } from '@/data/entries/approach';

import type {
  Entry,
  PairId,
  PartOfSpeech,
  PosId,
  SubjectGroup,
  SubjectId,
} from './types';

export const ENTRIES: Entry[] = [approach];

export const PAIRS: Record<
  PairId,
  {
    name: string;
    source: string;
    target: string;
    /** Язык слова и примеров — для атрибута lang, чтобы скринридер читал правильно */
    sourceLang: string;
    targetLang: string;
  }
> = {
  'en-ru': {
    name: 'Англо-русский словарь',
    source: 'EN',
    target: 'RU',
    sourceLang: 'en',
    targetLang: 'ru',
  },
  'ru-en': {
    name: 'Русско-английский словарь',
    source: 'RU',
    target: 'EN',
    sourceLang: 'ru',
    targetLang: 'en',
  },
};

export const SUBJECTS: Record<SubjectId, string> = {
  general: 'Общая лексика',
  aviation: 'Авиация',
  military: 'Военное дело',
  engineering: 'Техника',
  medicine: 'Медицина',
  golf: 'Гольф',
  math: 'Математика',
  law: 'Юриспруденция',
  economics: 'Экономика',
  logistics: 'Логистика',
};

export const POS_LABELS: Record<PosId, string> = {
  noun: 'Существительное',
  verb: 'Глагол',
};

export function isPairId(value: string): value is PairId {
  return value in PAIRS;
}

export function getEntry(pair: string, slug: string): Entry | undefined {
  return ENTRIES.find(entry => entry.pair === pair && entry.slug === slug);
}

export function countItems(groups: SubjectGroup[]): number {
  return groups.reduce((sum, group) => sum + group.items.length, 0);
}

/** Тематики по убыванию числа переводов: самые наполненные — сверху */
export function sortedGroups(part: PartOfSpeech): SubjectGroup[] {
  return [...part.groups].sort((a, b) => b.items.length - a.items.length);
}
