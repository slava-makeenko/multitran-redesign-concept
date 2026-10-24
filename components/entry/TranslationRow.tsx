import { CopyIcon } from '@/components/ui/icons';
import type { Translation } from '@/lib/types';

import styles from './entry.module.css';

interface Props {
  translation: Translation;
  sourceLang: string;
  hidden?: boolean;
}

export function TranslationRow({ translation, sourceLang, hidden }: Props) {
  const { text, gloss, example, author } = translation;

  return (
    <li className={styles.tr} hidden={hidden}>
      <div className={styles.trMain}>
        <span className={styles.trText}>{text}</span>
        {gloss && <span className={styles.trGloss}> — {gloss}</span>}
        {example && (
          <p className={styles.trExample}>
            <i lang={sourceLang}>{example.source}</i> — {example.target}
          </p>
        )}
      </div>
      <div className={styles.trSide}>
        {author && <span className={styles.trAuthor}>{author}</span>}
        {/* Копирование подключается на этапе 3 */}
        <button
          type="button"
          className={styles.copy}
          aria-label={`Копировать «${text}»`}
        >
          <CopyIcon size={16} />
        </button>
      </div>
    </li>
  );
}
