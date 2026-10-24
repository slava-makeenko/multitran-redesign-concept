import type { SearchItem } from './search';
import type { PairId } from './types';

const KEY = 'mt:search-history';
const LIMIT = 5;

export interface HistoryItem {
  pair: PairId;
  text: string;
  hint: string;
  href: string;
  /** Когда открыто, мс */
  at: number;
}

// Хранилище может быть недоступно (приватный режим, запрет cookies) или
// содержать что угодно — поэтому каждая запись проверяется, а адрес
// пропускается только внутренний, на статью
const HREF = /^\/(en-ru|ru-en)\/[a-z-]+\/(\?pos=[a-z]+)?$/;

function isHistoryItem(value: unknown): value is HistoryItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    (item.pair === 'en-ru' || item.pair === 'ru-en') &&
    typeof item.text === 'string' &&
    typeof item.hint === 'string' &&
    typeof item.href === 'string' &&
    HREF.test(item.href) &&
    typeof item.at === 'number'
  );
}

export function readHistory(): HistoryItem[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(data)
      ? data.filter(isHistoryItem).slice(0, LIMIT)
      : [];
  } catch {
    return [];
  }
}

export function addToHistory({ pair, text, hint, href }: SearchItem): void {
  try {
    const rest = readHistory().filter(
      item => item.href !== href || item.text !== text,
    );
    const next = [{ pair, text, hint, href, at: Date.now() }, ...rest];
    localStorage.setItem(KEY, JSON.stringify(next.slice(0, LIMIT)));
  } catch {
    // Без хранилища поиск работает, просто без истории
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // См. addToHistory
  }
}

const relative = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' });

/** «сегодня», «вчера», «позавчера», «5 дней назад» — по календарным дням */
export function whenSearched(at: number, now = Date.now()): string {
  const day = (time: number) => new Date(time).setHours(0, 0, 0, 0);
  const days = Math.round((day(now) - day(at)) / 86_400_000);
  return days <= 0 ? 'сегодня' : relative.format(-days, 'day');
}
