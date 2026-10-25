import 'server-only';

import { approach } from '@/data/entries/approach';
import { approval } from '@/data/entries/approval';
import { dueDiligence } from '@/data/entries/due-diligence';
import { leadTime } from '@/data/entries/lead-time';
import { zakhodNaPosadku } from '@/data/entries/zakhod-na-posadku';

import { SUBJECTS } from './dictionary';
import { buildSearchIndex } from './search';
import type { Entry, SubjectId } from './types';

// Статьи словаря — только на сервере, то есть при сборке. В браузер попадает
// то, что страница передала компонентам, и компактный индекс поиска.

// Порядок — как в примерах на главной
export const ENTRIES: Entry[] = [
  approach,
  dueDiligence,
  zakhodNaPosadku,
  leadTime,
  approval,
];

/** Индекс для подсказок: слова, фразы и значения, без переводов и примеров */
export const SEARCH_INDEX = buildSearchIndex(ENTRIES);

export function getEntry(pair: string, slug: string): Entry | undefined {
  return ENTRIES.find(entry => entry.pair === pair && entry.slug === slug);
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
