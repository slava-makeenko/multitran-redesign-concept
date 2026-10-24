import type { Phrase } from '@/lib/types';

import styles from './entry.module.css';

interface Props {
  phrases: Phrase[];
  sourceLang: string;
  targetLang: string;
}

export function PhrasesList({ phrases, sourceLang, targetLang }: Props) {
  return (
    <section className={`${styles.card} ${styles.listCard}`} aria-label="Фразы">
      <ul className={styles.phraseGrid}>
        {phrases.map(phrase => (
          <li key={phrase.source} className={styles.phraseRow}>
            <span className={styles.phraseSource} lang={sourceLang}>
              {phrase.source}
            </span>
            <span className={styles.phraseTarget} lang={targetLang}>
              {phrase.target}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
