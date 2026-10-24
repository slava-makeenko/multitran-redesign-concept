import type { Sense } from '@/lib/types';

import styles from './entry.module.css';

export function MainSenses({ senses }: { senses: Sense[] }) {
  return (
    <section
      className={`${styles.card} ${styles.mainSenses}`}
      aria-labelledby="main-senses"
    >
      <h2 id="main-senses" className={styles.mainSensesLabel}>
        Основные значения
      </h2>
      <ol className={styles.senses}>
        {senses.map((sense, index) => (
          <li key={sense.text} className={styles.sense}>
            <span className={styles.senseNumber} aria-hidden="true">
              {index + 1}
            </span>
            <span>
              <span className={styles.senseText}>{sense.text}</span>
              {sense.gloss && (
                <span className={styles.senseGloss}> {sense.gloss}</span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
