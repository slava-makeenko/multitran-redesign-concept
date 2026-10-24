import Link from 'next/link';

import { AdSlot } from '@/components/ui/AdSlot';
import { PlusIcon } from '@/components/ui/icons';
import ui from '@/components/ui/ui.module.css';
import { PAIRS } from '@/lib/dictionary';
import { count, DISCUSSION_FORMS, PHRASE_FORMS } from '@/lib/plural';
import type { Entry } from '@/lib/types';

import styles from './entry.module.css';

const VISIBLE_PHRASES = 4;

export function EntryAside({ entry }: { entry: Entry }) {
  const { sourceLang } = PAIRS[entry.pair];
  const [firstTopic] = entry.forum;

  return (
    <aside className={styles.aside} aria-label="Дополнительно">
      {entry.phrases.length > 0 && (
        <section className={`${styles.card} ${styles.asideCard}`}>
          <h2 className={styles.asideTitle}>
            Фразы с <span lang={sourceLang}>{entry.word}</span>
          </h2>
          <ul>
            {entry.phrases.slice(0, VISIBLE_PHRASES).map(phrase => (
              <li key={phrase.source} className={styles.phrase}>
                <span className={styles.phraseSource} lang={sourceLang}>
                  {phrase.source}
                </span>
                <span className={styles.phraseTarget}>{phrase.target}</span>
              </li>
            ))}
          </ul>
          {entry.phrases.length > VISIBLE_PHRASES && (
            <a className={styles.asideMore} href="#entry-tabs">
              Все {count(entry.phrases.length, PHRASE_FORMS)}
            </a>
          )}
        </section>
      )}

      <AdSlot size="rect" className="only-desktop" />

      {firstTopic && (
        <section className={`${styles.card} ${styles.asideCard}`}>
          <h2 className={styles.asideTitle}>На форуме</h2>
          <p className={styles.forumTopic}>{firstTopic.title}</p>
          <Link className={styles.asideMore} href="/about/#not-implemented">
            {count(entry.forum.length, DISCUSSION_FORMS)}
          </Link>
        </section>
      )}

      <section
        className={`${styles.card} ${styles.asideCard} ${styles.contribute}`}
      >
        <h2 className={styles.asideTitle}>Знаете перевод точнее?</h2>
        <p>
          Словарь пополняют переводчики. Добавьте свой вариант с тематикой и
          примером.
        </p>
        <Link
          className={`${ui.btn} ${ui.primary}`}
          href="/about/#not-implemented"
        >
          <PlusIcon size={18} />
          Добавить перевод
        </Link>
      </section>
    </aside>
  );
}
