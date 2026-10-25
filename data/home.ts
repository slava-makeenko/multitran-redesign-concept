import type { SubjectId } from '@/lib/types';

/**
 * Карточки «Популярные словари». В концепте есть только английский:
 * его карточка ведёт на словарь, остальные — на «в концепте не реализовано».
 * Цвета кружков подобраны так, чтобы белый текст читался (от 4,5:1).
 */
export const POPULAR_PAIRS = [
  {
    codes: ['EN', 'RU'],
    colors: ['#2c4a8a', '#b8322f'],
    name: 'Англо-русский',
    meta: 'и русско-английский',
    href: '/en-ru/',
  },
  {
    codes: ['DE', 'RU'],
    colors: ['#3a3a3a', '#b8322f'],
    name: 'Немецко-русский',
    meta: 'и русско-немецкий',
  },
  {
    codes: ['FR', 'RU'],
    colors: ['#2d5fb3', '#b8322f'],
    name: 'Французско-русский',
    meta: 'и русско-французский',
  },
  {
    codes: ['ES', 'RU'],
    colors: ['#9a6408', '#b8322f'],
    name: 'Испанско-русский',
    meta: 'и русско-испанский',
  },
  {
    codes: ['IT', 'RU'],
    colors: ['#277a45', '#b8322f'],
    name: 'Итальянско-русский',
    meta: 'и русско-итальянский',
  },
  {
    codes: ['ZH', 'RU'],
    colors: ['#c43c32', '#b8322f'],
    name: 'Китайско-русский',
    meta: 'и русско-китайский',
  },
];

/** «Сейчас обсуждают»: темы берутся из статей, здесь — только подпись и время */
export const FORUM_NOW: {
  slug: string;
  subject: SubjectId;
  ago: string;
  answered?: boolean;
}[] = [
  {
    slug: 'due-diligence',
    subject: 'law',
    ago: '12 минут назад',
    answered: true,
  },
  { slug: 'zakhod-na-posadku', subject: 'aviation', ago: '40 минут назад' },
  { slug: 'lead-time', subject: 'logistics', ago: '1 час назад' },
];
