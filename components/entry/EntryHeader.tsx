import Link from 'next/link';

import { PlusIcon, StarIcon } from '@/components/ui/icons';
import ui from '@/components/ui/ui.module.css';
import { PAIRS } from '@/lib/dictionary';
import type { Entry } from '@/lib/types';

import { PronounceButton } from './PronounceButton';
import styles from './entry.module.css';

export function EntryHeader({ entry }: { entry: Entry }) {
  const pair = PAIRS[entry.pair];

  return (
    <div>
      <p className={styles.crumbs}>{pair.name}</p>
      <div className={styles.titleRow}>
        <h1 className={styles.word} lang={pair.sourceLang}>
          {entry.word}
        </h1>
        {entry.ipa && (
          <span className={styles.ipa}>
            <span aria-label={`Транскрипция: ${entry.ipa}`}>[{entry.ipa}]</span>
            <PronounceButton text={entry.word} lang={pair.sourceLang} />
          </span>
        )}
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
