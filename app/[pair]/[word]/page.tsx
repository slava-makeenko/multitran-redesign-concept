import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EntryAside } from '@/components/entry/EntryAside';
import { EntryHeader } from '@/components/entry/EntryHeader';
import { EntryTabs, type TabInfo } from '@/components/entry/EntryTabs';
import { ForumList } from '@/components/entry/ForumList';
import { MainSenses } from '@/components/entry/MainSenses';
import { PhrasesList } from '@/components/entry/PhrasesList';
import { SubjectBrowser } from '@/components/entry/SubjectBrowser';
import { PageShell } from '@/components/layout/PageShell';
import { Search } from '@/components/search/Search';
import { countItems, PAIRS, POS_LABELS, sortedGroups } from '@/lib/dictionary';
import { ENTRIES, getEntry } from '@/lib/entries';

import styles from './page.module.css';

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

  const { sourceLang, targetLang } = PAIRS[entry.pair];
  const defaultPos = entry.parts[0].id;

  // Пустые «Фразы» и «Форум» не показываем: вкладка с нулём — тупик
  const tabs: TabInfo[] = [
    ...entry.parts.map(part => ({
      id: part.id,
      label: POS_LABELS[part.id],
      count: countItems(part.groups),
    })),
    { id: 'phrases', label: 'Фразы', count: entry.phrases.length },
    { id: 'forum', label: 'Форум', count: entry.forum.length },
  ].filter(tab => tab.count > 0);

  // Содержимое всех вкладок рендерится на сервере и лежит в статическом HTML:
  // клиент только переключает видимость
  const panels = {
    ...Object.fromEntries(
      entry.parts.map(part => [
        part.id,
        <>
          <MainSenses
            posId={part.id}
            senses={part.mainSenses}
            lang={targetLang}
          />
          <SubjectBrowser
            posId={part.id}
            defaultPos={defaultPos}
            groups={sortedGroups(part)}
            sourceLang={sourceLang}
            targetLang={targetLang}
          />
        </>,
      ]),
    ),
    phrases: (
      <PhrasesList
        phrases={entry.phrases}
        sourceLang={sourceLang}
        targetLang={targetLang}
      />
    ),
    forum: <ForumList topics={entry.forum} />,
  };

  return (
    <PageShell search={<Search pair={entry.pair} defaultValue={entry.word} />}>
      <div className={`container ${styles.layout}`}>
        <article className={styles.entry}>
          <EntryHeader entry={entry} />
          <EntryTabs tabs={tabs} panels={panels} />
        </article>

        <EntryAside entry={entry} />
      </div>
    </PageShell>
  );
}
