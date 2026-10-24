'use client';

import { FilterIcon } from '@/components/ui/icons';
import ui from '@/components/ui/ui.module.css';
import { SUBJECTS } from '@/lib/dictionary';
import { count, inSubjects, TRANSLATION_FORMS } from '@/lib/plural';
import type { SubjectGroup, SubjectId } from '@/lib/types';

import styles from './entry.module.css';

/** Сколько тематик видно чипами на десктопе; остальные — за «Ещё» */
const VISIBLE_CHIPS = 4;

interface Props {
  groups: SubjectGroup[];
  selected: SubjectId[];
  shownItems: number;
  shownGroups: number;
  chipsExpanded: boolean;
  onToggle: (id: SubjectId) => void;
  onReset: () => void;
  onExpandChips: () => void;
  onOpenSheet: () => void;
  sheetOpen: boolean;
}

export function SubjectFilter({
  groups,
  selected,
  shownItems,
  shownGroups,
  chipsExpanded,
  onToggle,
  onReset,
  onExpandChips,
  onOpenSheet,
  sheetOpen,
}: Props) {
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  // Выбранная тематика из адреса видна, даже если она за «Ещё»
  const showAll =
    chipsExpanded ||
    groups.some(
      (group, index) =>
        index >= VISIBLE_CHIPS && selected.includes(group.subject),
    );
  const chips = showAll ? groups : groups.slice(0, VISIBLE_CHIPS);
  const hiddenChips = groups.length - chips.length;

  return (
    <div className={styles.filters}>
      <span className={`${styles.filtersLabel} only-desktop`}>Тематики</span>
      <div
        className={`${styles.chips} only-desktop`}
        role="group"
        aria-label="Фильтр по тематикам"
      >
        <button
          type="button"
          className={ui.chip}
          aria-pressed={selected.length === 0}
          onClick={onReset}
        >
          Все <span className={ui.chipCount}>{total}</span>
        </button>
        {chips.map(group => (
          <button
            key={group.subject}
            type="button"
            className={ui.chip}
            aria-pressed={selected.includes(group.subject)}
            onClick={() => onToggle(group.subject)}
          >
            {SUBJECTS[group.subject]}{' '}
            <span className={ui.chipCount}>{group.items.length}</span>
          </button>
        ))}
        {hiddenChips > 0 && (
          <button
            type="button"
            className={`${ui.chip} ${ui.chipLine}`}
            onClick={onExpandChips}
          >
            Ещё {hiddenChips}
          </button>
        )}
      </div>

      <span className={`${styles.filtersLabel} only-mobile`}>
        {count(shownItems, TRANSLATION_FORMS)} {inSubjects(shownGroups)}
      </span>
      <button
        type="button"
        className={`${ui.btn} ${ui.ghost} ${styles.filtersButton} only-mobile`}
        aria-haspopup="dialog"
        aria-expanded={sheetOpen}
        onClick={onOpenSheet}
      >
        <FilterIcon size={18} />
        Тематики{selected.length > 0 && ` · ${selected.length}`}
      </button>
    </div>
  );
}
