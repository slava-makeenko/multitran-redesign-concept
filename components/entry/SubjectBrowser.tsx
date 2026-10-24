'use client';

import { Fragment, useEffect, useRef, useState } from 'react';

import { AdSlot } from '@/components/ui/AdSlot';
import { CheckIcon } from '@/components/ui/icons';
import { Sheet } from '@/components/ui/Sheet';
import ui from '@/components/ui/ui.module.css';
import { countItems, SUBJECTS } from '@/lib/dictionary';
import {
  count,
  inSubjects,
  SUBJECT_FORMS,
  TRANSLATION_FORMS,
} from '@/lib/plural';
import type { PosId, SubjectGroup, SubjectId } from '@/lib/types';
import { setSearchParams, useSearchParam } from '@/lib/url-state';

import { SubjectFilter } from './SubjectFilter';
import { SubjectGroupCard } from './SubjectGroupCard';
import styles from './entry.module.css';

/** Сколько тематик раскрыто сразу и сколько показано до «Ещё N тематик» */
const OPEN_GROUPS = 2;
const VISIBLE_GROUPS = 5;

interface Props {
  posId: PosId;
  defaultPos: PosId;
  /** Уже отсортированы по числу переводов */
  groups: SubjectGroup[];
  sourceLang: string;
  targetLang: string;
}

export function SubjectBrowser({
  posId,
  defaultPos,
  groups,
  sourceLang,
  targetLang,
}: Props) {
  // Выбранные тематики живут в адресе (?s=aviation,general) — только у активной вкладки
  const pos = useSearchParam('pos') ?? defaultPos;
  const subjectsParam = useSearchParam('s');
  const selected: SubjectId[] =
    pos === posId && subjectsParam
      ? groups
          .map(group => group.subject)
          .filter(id => subjectsParam.split(',').includes(id))
      : [];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      groups.map((group, index) => [group.subject, index < OPEN_GROUPS]),
    ),
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [allGroups, setAllGroups] = useState(false);
  const [chipsExpanded, setChipsExpanded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState<SubjectId[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const headings = useRef<Record<string, HTMLButtonElement | null>>({});

  const isFiltered = selected.length > 0;
  const shown = isFiltered
    ? groups.filter(group => selected.includes(group.subject))
    : groups;
  const extraGroups = groups.slice(VISIBLE_GROUPS);

  const apply = (ids: SubjectId[]) => {
    setSearchParams({ s: ids.length ? ids.join(',') : null });
    if (ids.length) {
      // Выбранные тематики раскрываются, чтобы сразу видеть переводы
      setOpenGroups(current => ({
        ...current,
        ...Object.fromEntries(ids.map(id => [id, true])),
      }));
      const result = groups.filter(group => ids.includes(group.subject));
      setAnnouncement(
        `Найдено: ${count(countItems(result), TRANSLATION_FORMS)} ${inSubjects(result.length)}`,
      );
    } else {
      setAnnouncement('Показаны все тематики');
    }
  };

  const toggleSubject = (id: SubjectId) =>
    apply(
      selected.includes(id)
        ? selected.filter(item => item !== id)
        : [...selected, id],
    );

  // После «Ещё N тематик» кнопка исчезает — фокус на первую открытую тематику
  const wasAllGroups = useRef(allGroups);
  useEffect(() => {
    if (allGroups && !wasAllGroups.current) {
      headings.current[groups[VISIBLE_GROUPS]?.subject]?.focus();
    }
    wasAllGroups.current = allGroups;
  }, [allGroups, groups]);

  // Мемоизацию делает React Compiler
  const closeSheet = () => setSheetOpen(false);
  const draftGroups = draft.length
    ? groups.filter(group => draft.includes(group.subject))
    : groups;

  return (
    <>
      <SubjectFilter
        groups={groups}
        selected={selected}
        shownItems={countItems(shown)}
        shownGroups={shown.length}
        chipsExpanded={chipsExpanded}
        onToggle={toggleSubject}
        onReset={() => apply([])}
        onExpandChips={() => setChipsExpanded(true)}
        onOpenSheet={() => {
          setDraft(selected);
          setSheetOpen(true);
        }}
        sheetOpen={sheetOpen}
      />
      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>

      {shown.map((group, index) => (
        <Fragment key={group.subject}>
          <SubjectGroupCard
            posId={posId}
            group={group}
            sourceLang={sourceLang}
            targetLang={targetLang}
            open={openGroups[group.subject]}
            onToggle={() =>
              setOpenGroups(current => ({
                ...current,
                [group.subject]: !current[group.subject],
              }))
            }
            expanded={Boolean(expanded[group.subject])}
            onExpand={() =>
              setExpanded(current => ({ ...current, [group.subject]: true }))
            }
            hidden={!isFiltered && !allGroups && index >= VISIBLE_GROUPS}
            headingRef={element => {
              headings.current[group.subject] = element;
            }}
          />
          {/* На телефоне реклама — в ленте после первой тематики */}
          {index === 0 && <AdSlot size="feed" className="only-mobile" />}
        </Fragment>
      ))}

      {!isFiltered && !allGroups && extraGroups.length > 0 && (
        <button
          type="button"
          className={`${ui.btn} ${ui.ghost} ${ui.block}`}
          onClick={() => setAllGroups(true)}
        >
          Ещё {count(extraGroups.length, SUBJECT_FORMS)} ·{' '}
          {count(countItems(extraGroups), TRANSLATION_FORMS)}
        </button>
      )}

      <Sheet
        open={sheetOpen}
        onClose={closeSheet}
        title="Тематики"
        footer={
          <div className={styles.sheetActions}>
            <button
              type="button"
              className={`${ui.btn} ${ui.ghost}`}
              onClick={() => setDraft([])}
            >
              Сбросить
            </button>
            <button
              type="button"
              className={`${ui.btn} ${ui.primary}`}
              onClick={() => {
                apply(draft);
                setSheetOpen(false);
              }}
            >
              Показать {count(countItems(draftGroups), TRANSLATION_FORMS)}
            </button>
          </div>
        }
      >
        <fieldset className={styles.checkList}>
          <legend className="visually-hidden">Выберите тематики</legend>
          {groups.map(group => {
            const checked = draft.includes(group.subject);
            return (
              <label key={group.subject} className={styles.check}>
                <input
                  type="checkbox"
                  className={styles.checkInput}
                  checked={checked}
                  onChange={() =>
                    setDraft(current =>
                      checked
                        ? current.filter(id => id !== group.subject)
                        : [...current, group.subject],
                    )
                  }
                />
                <span className={styles.checkBox} aria-hidden="true">
                  <CheckIcon size={16} />
                </span>
                {SUBJECTS[group.subject]}
                <span className={styles.checkCount}>{group.items.length}</span>
              </label>
            );
          })}
        </fieldset>
      </Sheet>
    </>
  );
}
