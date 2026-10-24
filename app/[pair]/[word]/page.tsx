import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

import { EntryAside } from '@/components/entry/EntryAside';
import { EntryHeader } from '@/components/entry/EntryHeader';
import { MainSenses } from '@/components/entry/MainSenses';
import { PosTabs } from '@/components/entry/PosTabs';
import { SubjectFilter } from '@/components/entry/SubjectFilter';
import { SubjectGroupCard } from '@/components/entry/SubjectGroupCard';
import { PageShell } from '@/components/layout/PageShell';
import { SearchBox } from '@/components/search/SearchBox';
import { AdSlot } from '@/components/ui/AdSlot';
import ui from '@/components/ui/ui.module.css';
import { ENTRIES, getEntry, PAIRS, sortedGroups } from '@/lib/dictionary';
import { count, SUBJECT_FORMS, TRANSLATION_FORMS } from '@/lib/plural';

import styles from './page.module.css';

/** Сколько тематик раскрыто сразу и сколько показано до «Ещё N тематик» */
const OPEN_GROUPS = 2;
const VISIBLE_GROUPS = 5;

// Только статьи из data/: остальные адреса — 404 (статический экспорт)
export const dynamicParams = false;

export function generateStaticParams() {
  return ENTRIES.map(entry => ({ pair: entry.pair, word: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[pair]/[word]'>): Promise<Metadata> {
  const { pair, word } = await params;
  const entry = getEntry(pair, word);
  if (!entry) return {};
  const direction =
    entry.pair === 'en-ru'
      ? 'с английского на русский'
      : 'с русского на английский';
  return {
    title: `${entry.word}: перевод ${direction}`,
  };
}

export default async function EntryPage({
  params,
}: PageProps<'/[pair]/[word]'>) {
  const { pair, word } = await params;
  const entry = getEntry(pair, word);
  if (!entry) notFound();

  const { sourceLang } = PAIRS[entry.pair];
  const [part] = entry.parts;
  const groups = sortedGroups(part);
  const hiddenGroups = groups.slice(VISIBLE_GROUPS);
  const hiddenItems = hiddenGroups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  return (
    <PageShell
      search={<SearchBox pair={entry.pair} defaultValue={entry.word} />}
    >
      <div className={`container ${styles.layout}`}>
        <article className={styles.entry}>
          <EntryHeader entry={entry} />
          <PosTabs entry={entry} />
          <MainSenses senses={part.mainSenses} />
          <SubjectFilter groups={groups} />

          {groups.map((group, index) => (
            <Fragment key={group.subject}>
              <SubjectGroupCard
                group={group}
                sourceLang={sourceLang}
                open={index < OPEN_GROUPS}
                hidden={index >= VISIBLE_GROUPS}
              />
              {/* На телефоне реклама — в ленте после первой тематики */}
              {index === 0 && <AdSlot size="feed" className="only-mobile" />}
            </Fragment>
          ))}

          {hiddenGroups.length > 0 && (
            <button
              type="button"
              className={`${ui.btn} ${ui.ghost} ${ui.block}`}
            >
              Ещё {count(hiddenGroups.length, SUBJECT_FORMS)} ·{' '}
              {count(hiddenItems, TRANSLATION_FORMS)}
            </button>
          )}
        </article>

        <EntryAside entry={entry} />
      </div>
    </PageShell>
  );
}
