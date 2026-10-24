import type { PosId, Sense } from '@/lib/types';

import styles from './entry.module.css';

export function MainSenses({
  posId,
  senses,
}: {
  posId: PosId;
  senses: Sense[];
}) {
  const labelId = `main-senses-${posId}`;
  return (
    <section
      className={`${styles.card} ${styles.mainSenses}`}
      aria-labelledby={labelId}
    >
      <h2 id={labelId} className={styles.mainSensesLabel}>
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
