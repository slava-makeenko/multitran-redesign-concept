'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { isPairId, PAIRS } from '@/lib/dictionary';
import { count, MATCH_FORMS } from '@/lib/plural';
import {
  didYouMean,
  searchPair,
  suggest,
  type SearchItem,
  type SearchKind,
} from '@/lib/search';
import { addToHistory } from '@/lib/search-history';
import type { PairId } from '@/lib/types';

import { SearchBox } from './SearchBox';
import styles from './SearchResults.module.css';

const KIND_LABELS: Record<SearchKind, string> = {
  entry: 'статья',
  phrase: 'фраза',
  sense: 'значение',
};

/** Запрос и направление из адреса /search/?q=…&pair=… */
function useQuery(): { q: string; pair: PairId } {
  const params = useSearchParams();
  const q = (params.get('q') ?? '').trim();
  const requested = params.get('pair') ?? '';
  return { q, pair: searchPair(q, isPairId(requested) ? requested : 'en-ru') };
}

/** Поле поиска в шапке с тем же запросом, что и в адресе */
export function SearchFromUrl() {
  const { q, pair } = useQuery();
  return <SearchBox key={`${pair}:${q}`} pair={pair} defaultValue={q} />;
}

function ResultLink({ item }: { item: SearchItem }) {
  const { sourceLang, targetLang } = PAIRS[item.pair];
  return (
    <Link
      className={styles.result}
      href={item.href}
      onClick={() => addToHistory(item)}
    >
      <span className={styles.resultText} lang={sourceLang}>
        {item.text}
      </span>
      <span className={styles.resultHint} lang={targetLang}>
        {item.hint}
      </span>
      <span className={styles.kind}>{KIND_LABELS[item.kind]}</span>
    </Link>
  );
}

export function SearchResults() {
  const { q, pair } = useQuery();

  if (!q) {
    return (
      <>
        <h1 className={styles.title}>Поиск</h1>
        <p className={styles.summary}>
          Введите слово, термин или фразу в поле вверху.
        </p>
      </>
    );
  }

  const results = suggest(q, pair, 30);
  const guess = results.length ? null : didYouMean(q, pair);

  return (
    <>
      <h1 className={styles.title}>
        Поиск: «<span lang={PAIRS[pair].sourceLang}>{q}</span>»
      </h1>
      <p className={styles.summary}>
        {PAIRS[pair].name} ·{' '}
        {results.length
          ? count(results.length, MATCH_FORMS)
          : 'ничего не найдено'}
      </p>

      {results.length > 0 && (
        <ul className={styles.card}>
          {results.map(item => (
            <li key={`${item.kind}:${item.text}`} className={styles.row}>
              <ResultLink item={item} />
            </li>
          ))}
        </ul>
      )}

      {guess && (
        <div className={styles.card}>
          <p className={styles.guessLabel}>Возможно, вы искали</p>
          <ResultLink item={guess} />
        </div>
      )}

      {!results.length && !guess && (
        <p className={styles.empty}>
          Проверьте написание или попробуйте другое слово. В концепте пять
          учебных статей — они ниже.
        </p>
      )}
    </>
  );
}
