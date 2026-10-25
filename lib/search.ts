import { entryHint, entryHref, otherPair } from './dictionary';
import type { Entry, PairId } from './types';

/**
 * Что можно найти:
 * - entry — статья целиком;
 * - phrase — фраза из статьи, ведёт на вкладку «Фразы»;
 * - sense — основное значение статьи в обратном направлении:
 *   «одобрение» в RU → EN находит approval.
 */
export type SearchKind = 'entry' | 'phrase' | 'sense';

export interface SearchItem {
  kind: SearchKind;
  pair: PairId;
  text: string;
  hint: string;
  href: string;
}

export interface Suggestion extends SearchItem {
  /** Совпавший отрезок text — подсвечивается в подсказке */
  match: [number, number];
}

const KIND_ORDER: Record<SearchKind, number> = {
  entry: 0,
  phrase: 1,
  sense: 2,
};

/**
 * Регистр, ё и дефисы не важны. Длина строки не меняется,
 * поэтому позиции совпадения подходят и для исходного текста.
 */
function fold(value: string): string {
  return value
    .toLocaleLowerCase('ru')
    .replace(/ё/g, 'е')
    .replace(/[-‐–—]/g, ' ');
}

export function normalizeQuery(query: string): string {
  return fold(query).replace(/\s+/g, ' ').trim();
}

/** Индекс поиска: собирается при сборке и передаётся в поле поиска пропом */
export type SearchIndex = SearchItem[];

/**
 * Собирает индекс из статей. Вызывается на сервере (lib/entries.ts): так в
 * браузер попадают только слова, фразы и значения, а не статьи целиком.
 */
export function buildSearchIndex(entries: Entry[]): SearchIndex {
  const items: SearchItem[] = [];
  for (const entry of entries) {
    const href = entryHref(entry);
    items.push({
      kind: 'entry',
      pair: entry.pair,
      text: entry.word,
      hint: entryHint(entry),
      href,
    });
    for (const phrase of entry.phrases) {
      items.push({
        kind: 'phrase',
        pair: entry.pair,
        text: phrase.source,
        hint: phrase.target,
        href: entryHref(entry, 'phrases'),
      });
    }
    for (const part of entry.parts) {
      for (const sense of part.mainSenses) {
        for (const text of sense.text.split(/,\s*/)) {
          items.push({
            kind: 'sense',
            pair: otherPair(entry.pair),
            text,
            hint: entry.word,
            href,
          });
        }
      }
    }
  }

  // Одинаковый текст в одном направлении остаётся один раз: статья важнее фразы
  const seen = new Set<string>();
  return items
    .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind])
    .filter(item => {
      const key = `${item.pair}:${fold(item.text)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/** 0 — точное совпадение, 1 — начало строки, 2 — начало слова, null — нет */
function matchAt(folded: string, q: string): [number, number] | null {
  if (folded.startsWith(q)) return [folded === q ? 0 : 1, 0];
  const index = ` ${folded}`.indexOf(` ${q}`);
  return index === -1 ? null : [2, index];
}

export function suggest(
  index: SearchIndex,
  query: string,
  pair: PairId,
  limit = 6,
): Suggestion[] {
  const q = normalizeQuery(query);
  if (q.length < 2) return [];
  return index
    .flatMap(item => {
      if (item.pair !== pair) return [];
      const found = matchAt(fold(item.text), q);
      return found ? [{ item, rank: found[0], start: found[1] }] : [];
    })
    .sort(
      (a, b) =>
        a.rank - b.rank ||
        KIND_ORDER[a.item.kind] - KIND_ORDER[b.item.kind] ||
        a.item.text.length - b.item.text.length ||
        a.item.text.localeCompare(b.item.text),
    )
    .slice(0, limit)
    .map(({ item, start }) => ({
      kind: item.kind,
      pair: item.pair,
      text: item.text,
      hint: item.hint,
      href: item.href,
      match: [start, start + q.length],
    }));
}

/** Направление по алфавиту запроса: кириллица — RU → EN, латиница — EN → RU */
export function detectPair(query: string): PairId | null {
  if (/[а-яё]/i.test(query)) return 'ru-en';
  if (/[a-z]/i.test(query)) return 'en-ru';
  return null;
}

/** Направление поиска: по алфавиту запроса, а для цифр и знаков — выбранное */
export function searchPair(query: string, pair: PairId): PairId {
  return detectPair(query) ?? pair;
}

/** Расстояние Дамерау — Левенштейна: перестановка соседних букв — одна ошибка */
function distance(a: string, b: string): number {
  const rows = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0,
    ),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + cost,
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
      }
    }
  }
  return rows[a.length][b.length];
}

/** «Возможно, вы искали»: ближайшее слово с опечаткой не больше одной-двух букв */
export function didYouMean(
  index: SearchIndex,
  query: string,
  pair: PairId,
): SearchItem | null {
  const q = normalizeQuery(query);
  if (q.length < 3) return null;
  const limit = q.length <= 4 ? 1 : 2;
  let best: { item: SearchItem; score: number } | null = null;
  for (const item of index) {
    if (item.pair !== pair) continue;
    // Сравниваем и со словом целиком, и с его началом той же длины, что запрос
    const folded = fold(item.text);
    const score = Math.min(
      distance(q, folded),
      distance(q, folded.slice(0, q.length)),
    );
    if (
      score <= limit &&
      (!best ||
        score < best.score ||
        (score === best.score &&
          KIND_ORDER[item.kind] < KIND_ORDER[best.item.kind]))
    ) {
      best = { item, score };
    }
  }
  if (!best) return null;
  const { kind, text, hint, href } = best.item;
  return { kind, pair, text, hint, href };
}
