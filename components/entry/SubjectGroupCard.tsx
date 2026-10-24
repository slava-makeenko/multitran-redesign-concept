'use client';

import { useEffect, useRef } from 'react';

import { ChevronDownIcon } from '@/components/ui/icons';
import ui from '@/components/ui/ui.module.css';
import { SUBJECTS } from '@/lib/dictionary';
import { count, plural, TRANSLATION_FORMS } from '@/lib/plural';
import type { PosId, SubjectGroup } from '@/lib/types';

import { TranslationRow } from './TranslationRow';
import styles from './entry.module.css';

/** Сколько переводов видно в открытой группе до «Показать ещё» */
export const VISIBLE_ITEMS = 6;

interface Props {
  posId: PosId;
  group: SubjectGroup;
  sourceLang: string;
  targetLang: string;
  open: boolean;
  onToggle: () => void;
  expanded: boolean;
  onExpand: () => void;
  hidden?: boolean;
  headingRef?: (element: HTMLButtonElement | null) => void;
}

export function SubjectGroupCard({
  posId,
  group,
  sourceLang,
  targetLang,
  open,
  onToggle,
  expanded,
  onExpand,
  hidden,
  headingRef,
}: Props) {
  const name = SUBJECTS[group.subject];
  const bodyId = `group-${posId}-${group.subject}`;
  const rest = group.items.length - VISIBLE_ITEMS;

  // После «Показать ещё» кнопка исчезает — фокус переносим на первую новую строку
  const firstRevealed = useRef<HTMLLIElement>(null);
  const wasExpanded = useRef(expanded);
  useEffect(() => {
    if (expanded && !wasExpanded.current) firstRevealed.current?.focus();
    wasExpanded.current = expanded;
  }, [expanded]);

  return (
    <section
      className={`${styles.card} ${styles.group}`}
      aria-label={name}
      hidden={hidden}
    >
      <h2 className={styles.groupHeading}>
        <button
          ref={headingRef}
          type="button"
          className={styles.groupHead}
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={onToggle}
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
        {/* Все переводы есть в HTML; сверх шести скрыты до «Показать ещё» */}
        <ul>
          {group.items.map((item, index) => (
            <TranslationRow
              key={`${item.text}-${index}`}
              translation={item}
              sourceLang={sourceLang}
              targetLang={targetLang}
              hidden={!expanded && index >= VISIBLE_ITEMS}
              rowRef={index === VISIBLE_ITEMS ? firstRevealed : undefined}
            />
          ))}
        </ul>
        {rest > 0 && !expanded && (
          <button
            type="button"
            className={`${ui.btn} ${ui.soft} ${ui.block} ${styles.more}`}
            onClick={onExpand}
          >
            Показать ещё {count(rest, TRANSLATION_FORMS)}
          </button>
        )}
      </div>
    </section>
  );
}
