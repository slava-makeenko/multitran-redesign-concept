import { ChevronDownIcon } from '@/components/ui/icons';
import ui from '@/components/ui/ui.module.css';
import { SUBJECTS } from '@/lib/dictionary';
import { count, plural, TRANSLATION_FORMS } from '@/lib/plural';
import type { SubjectGroup } from '@/lib/types';

import { TranslationRow } from './TranslationRow';
import styles from './entry.module.css';

/** Сколько переводов видно в открытой группе до «Показать ещё» */
const VISIBLE_ITEMS = 6;

interface Props {
  group: SubjectGroup;
  sourceLang: string;
  open: boolean;
  hidden?: boolean;
}

// Этап 2: группы отрисованы в нужном состоянии, раскрытие — этап 3.
// Свёрнутое содержимое уже в HTML, просто скрыто.
export function SubjectGroupCard({ group, sourceLang, open, hidden }: Props) {
  const name = SUBJECTS[group.subject];
  const bodyId = `group-${group.subject}`;
  const rest = group.items.length - VISIBLE_ITEMS;

  return (
    <section
      className={`${styles.card} ${styles.group}`}
      aria-label={name}
      hidden={hidden}
    >
      <h2 className={styles.groupHeading}>
        <button
          type="button"
          className={styles.groupHead}
          aria-expanded={open}
          aria-controls={bodyId}
        >
          <span className={styles.groupName}>{name}</span>{' '}
          <span className={styles.groupCount}>
            {group.items.length}
            <span className="visually-hidden">
              {' '}
              {plural(group.items.length, TRANSLATION_FORMS)}
            </span>
          </span>
          <ChevronDownIcon className={styles.groupChevron} size={20} />
        </button>
      </h2>
      <div id={bodyId} className={styles.groupBody} hidden={!open}>
        <ul>
          {group.items.map((item, index) => (
            <TranslationRow
              key={`${item.text}-${index}`}
              translation={item}
              sourceLang={sourceLang}
              hidden={index >= VISIBLE_ITEMS}
            />
          ))}
        </ul>
        {rest > 0 && (
          <button
            type="button"
            className={`${ui.btn} ${ui.soft} ${ui.block} ${styles.more}`}
          >
            Показать ещё {count(rest, TRANSLATION_FORMS)}
          </button>
        )}
      </div>
    </section>
  );
}
