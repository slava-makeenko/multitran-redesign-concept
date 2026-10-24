import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { PageShell } from '@/components/layout/PageShell';
import { SearchBox } from '@/components/search/SearchBox';
import {
  SearchFromUrl,
  SearchResults,
} from '@/components/search/SearchResults';
import styles from '@/components/search/SearchResults.module.css';
import { ENTRIES, entryHint, entryHref, PAIRS } from '@/lib/dictionary';

export const metadata: Metadata = {
  title: 'Поиск',
};

// Запрос читается из адреса уже в браузере: страница статическая.
// В HTML — заглушки и список всех статей, их видно и без JS.
export default function SearchPage() {
  return (
    <PageShell
      search={
        <Suspense fallback={<SearchBox pair="en-ru" />}>
          <SearchFromUrl />
        </Suspense>
      }
    >
      <div className={`container ${styles.page}`}>
        <Suspense fallback={<h1 className={styles.title}>Поиск</h1>}>
          <SearchResults />
        </Suspense>

        <section className={styles.all} aria-labelledby="all-entries">
          <h2 id="all-entries" className={styles.allTitle}>
            Статьи в концепте
          </h2>
          <ul className={styles.allList}>
            {ENTRIES.map(entry => (
              <li key={entry.slug}>
                <Link className={styles.allLink} href={entryHref(entry)}>
                  <span
                    className={styles.allWord}
                    lang={PAIRS[entry.pair].sourceLang}
                  >
                    {entry.word}
                  </span>
                  <span
                    className={styles.allHint}
                    lang={PAIRS[entry.pair].targetLang}
                  >
                    {entryHint(entry)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
