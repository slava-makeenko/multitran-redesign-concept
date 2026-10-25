import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageShell } from '@/components/layout/PageShell';
import { Search } from '@/components/search/Search';
import styles from '@/components/search/SearchResults.module.css';
import { SwapIcon } from '@/components/ui/icons';
import ui from '@/components/ui/ui.module.css';
import {
  countItems,
  entryHint,
  entryHref,
  isPairId,
  otherPair,
  PAIRS,
} from '@/lib/dictionary';
import { ENTRIES } from '@/lib/entries';
import { count, inSubjects, TRANSLATION_FORMS } from '@/lib/plural';
import type { PairId } from '@/lib/types';

export const dynamicParams = false;

export function generateStaticParams() {
  return (Object.keys(PAIRS) as PairId[]).map(pair => ({ pair }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[pair]'>): Promise<Metadata> {
  const { pair } = await params;
  return isPairId(pair) ? { title: PAIRS[pair].name } : {};
}

// Оглавление словаря: в концепте — только учебные статьи этого направления
export default async function DictionaryPage({ params }: PageProps<'/[pair]'>) {
  const { pair } = await params;
  if (!isPairId(pair)) notFound();

  const { name, sourceLang, targetLang } = PAIRS[pair];
  const reverse = otherPair(pair);
  const entries = ENTRIES.filter(entry => entry.pair === pair);

  return (
    <PageShell search={<Search pair={pair} />}>
      <div className={`container ${styles.page}`}>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.summary}>
          Учебных статей в концепте: {entries.length}. Полный словарь в концепт
          не переносился.
        </p>

        <ul className={styles.card}>
          {entries.map(entry => {
            const groups = entry.parts.flatMap(part => part.groups);
            const subjects = new Set(groups.map(group => group.subject));
            return (
              <li key={entry.slug} className={styles.row}>
                <Link className={styles.result} href={entryHref(entry)}>
                  <span className={styles.resultText} lang={sourceLang}>
                    {entry.word}
                  </span>
                  <span className={styles.resultHint} lang={targetLang}>
                    {entryHint(entry)}
                  </span>
                  <span className={styles.kind}>
                    {count(countItems(groups), TRANSLATION_FORMS)}{' '}
                    {inSubjects(subjects.size)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link className={`${ui.btn} ${ui.ghost}`} href={`/${reverse}/`}>
          <SwapIcon size={18} />
          {PAIRS[reverse].name}
        </Link>
      </div>
    </PageShell>
  );
}
