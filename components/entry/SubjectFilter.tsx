import { FilterIcon } from '@/components/ui/icons';
import ui from '@/components/ui/ui.module.css';
import { SUBJECTS } from '@/lib/dictionary';
import { count, inSubjects, TRANSLATION_FORMS } from '@/lib/plural';
import type { SubjectGroup } from '@/lib/types';

import styles from './entry.module.css';

/** Сколько тематик видно чипами на десктопе; остальные — за «Ещё» */
const VISIBLE_CHIPS = 4;

// Этап 2: фильтр показан, выбор тематик и шторка — этап 3
export function SubjectFilter({ groups }: { groups: SubjectGroup[] }) {
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const hidden = groups.length - VISIBLE_CHIPS;

  return (
    <div className={styles.filters}>
      <span className={`${styles.filtersLabel} only-desktop`}>Тематики</span>
      <div
        className={`${styles.chips} only-desktop`}
        role="group"
        aria-label="Фильтр по тематикам"
      >
        <button type="button" className={ui.chip} aria-pressed="true">
          Все <span className={ui.chipCount}>{total}</span>
        </button>
        {groups.slice(0, VISIBLE_CHIPS).map(group => (
          <button
            key={group.subject}
            type="button"
            className={ui.chip}
            aria-pressed="false"
          >
            {SUBJECTS[group.subject]}
            <span className={ui.chipCount}>{group.items.length}</span>
          </button>
        ))}
        {hidden > 0 && (
          <button type="button" className={`${ui.chip} ${ui.chipLine}`}>
            Ещё {hidden}
          </button>
        )}
      </div>

      <span className={`${styles.filtersLabel} only-mobile`}>
        {count(total, TRANSLATION_FORMS)} {inSubjects(groups.length)}
      </span>
      <button
        type="button"
        className={`${ui.btn} ${ui.ghost} ${styles.filtersButton} only-mobile`}
      >
        <FilterIcon size={18} />
        Тематики
      </button>
    </div>
  );
}
