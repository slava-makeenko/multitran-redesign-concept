import { approach } from '@/data/entries/approach';
import { approval } from '@/data/entries/approval';
import { dueDiligence } from '@/data/entries/due-diligence';
import { leadTime } from '@/data/entries/lead-time';
import { zakhodNaPosadku } from '@/data/entries/zakhod-na-posadku';

import type {
  Entry,
  PairId,
  PartOfSpeech,
  PosId,
  SubjectGroup,
  SubjectId,
} from './types';

// Порядок — как в примерах на главной
export const ENTRIES: Entry[] = [
  approach,
  dueDiligence,
  zakhodNaPosadku,
  leadTime,
  approval,
];

export const PAIRS: Record<
  PairId,
  {
    name: string;
    /** Коды для компактного поиска в шапке */
    source: string;
    target: string;
    /** Полные названия — для большого поиска на главной */
    sourceName: string;
    targetName: string;
    /** Язык слова и примеров — для атрибута lang, чтобы скринридер читал правильно */
    sourceLang: string;
    targetLang: string;
  }
> = {
  'en-ru': {
    name: 'Англо-русский словарь',
    source: 'EN',
    target: 'RU',
    sourceName: 'Английский',
    targetName: 'Русский',
    sourceLang: 'en',
    targetLang: 'ru',
  },
  'ru-en': {
    name: 'Русско-английский словарь',
    source: 'RU',
    target: 'EN',
    sourceName: 'Русский',
    targetName: 'Английский',
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

export function otherPair(pair: PairId): PairId {
  return pair === 'en-ru' ? 'ru-en' : 'en-ru';
}

/** Адрес статьи без basePath — его добавляют Link и router */
export function entryHref(entry: Entry, tab?: string): string {
  return `/${entry.pair}/${entry.slug}/${tab ? `?pos=${tab}` : ''}`;
}

/** Первые значения статьи одной строкой — для подсказок поиска */
export function entryHint(entry: Entry): string {
  return entry.parts[0].mainSenses
    .slice(0, 3)
    .map(sense => sense.text)
    .join(', ');
}

export interface SubjectLink {
  subject: SubjectId;
  name: string;
  /** Переводов этой тематики во всех статьях */
  total: number;
  /** Статья, где переводов тематики больше всего, — сразу с фильтром */
  href: string;
}

/** Тематики для главной: без общей лексики, самые наполненные — первыми */
export function subjectLinks(): SubjectLink[] {
  const found = new Map<
    SubjectId,
    { total: number; top: number; href: string }
  >();
  for (const entry of ENTRIES) {
    for (const part of entry.parts) {
      for (const { subject, items } of part.groups) {
        if (subject === 'general') continue;
        const current = found.get(subject) ?? { total: 0, top: 0, href: '' };
        current.total += items.length;
        if (items.length > current.top) {
          // Фильтр работает на своей вкладке: для глагола нужен ?pos=verb
          const pos = part.id === entry.parts[0].id ? '' : `pos=${part.id}&`;
          current.top = items.length;
          current.href = `/${entry.pair}/${entry.slug}/?${pos}s=${subject}`;
        }
        found.set(subject, current);
      }
    }
  }
  return [...found]
    .sort((a, b) => b[1].total - a[1].total)
    .map(([subject, { total, href }]) => ({
      subject,
      name: SUBJECTS[subject],
      total,
      href,
    }));
}

/**
 * Имя для View Transitions: одно и то же у слова в подсказке или списке
 * и у заголовка статьи — по нему браузер связывает их при переходе.
 * Только для адреса самой статьи, без вкладки.
 */
export function morphName(href: string): string | undefined {
  const match = /^\/(en-ru|ru-en)\/([a-z-]+)\/$/.exec(href);
  return match ? `entry-${match[1]}-${match[2]}` : undefined;
}
