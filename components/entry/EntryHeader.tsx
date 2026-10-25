import Link from 'next/link';
import { ViewTransition } from 'react';

import { PlusIcon, StarIcon } from '@/components/ui/icons';
import ui from '@/components/ui/ui.module.css';
import { entryHref, morphName, PAIRS } from '@/lib/dictionary';
import type { Entry } from '@/lib/types';

import { PronounceButton } from './PronounceButton';
import styles from './entry.module.css';

export function EntryHeader({ entry }: { entry: Entry }) {
  const pair = PAIRS[entry.pair];

  return (
    <div>
      <p className={styles.crumbs}>
        <Link href={`/${entry.pair}/`}>{pair.name}</Link>
      </p>
      <div className={styles.titleRow}>
        {/* То же имя у слова в подсказке и в списках: при переходе оно
            «перелетает» сюда (View Transitions) */}
        <ViewTransition
          name={morphName(entryHref(entry))}
          share="morph"
          default="none"
        >
          <h1 className={styles.word} lang={pair.sourceLang}>
            {entry.word}
          </h1>
        </ViewTransition>
        {/* У русских статей транскрипции нет, а произношение есть */}
        <span className={styles.ipa}>
          {entry.ipa && (
            <span
              className={styles.transcription}
              aria-label={`Транскрипция: ${entry.ipa}`}
            >
              [{entry.ipa}]
            </span>
          )}
          <PronounceButton text={entry.word} lang={pair.sourceLang} />
        </span>
        <span className={styles.actions}>
          <Link
            className={`${ui.btn} ${ui.ghost}`}
            href="/about/#not-implemented"
          >
            <StarIcon size={18} />В избранное
          </Link>
          <Link
            className={`${ui.btn} ${ui.soft}`}
            href="/about/#not-implemented"
          >
            <PlusIcon size={18} />
            Добавить перевод
          </Link>
        </span>
      </div>
    </div>
  );
}
