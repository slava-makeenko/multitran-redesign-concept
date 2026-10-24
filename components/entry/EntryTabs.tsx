'use client';

import { useRef, type KeyboardEvent, type ReactNode } from 'react';

import { setSearchParams, useSearchParam } from '@/lib/url-state';

import styles from './entry.module.css';

export interface TabInfo {
  id: string;
  label: string;
  count: number;
}

interface Props {
  tabs: TabInfo[];
  /** Содержимое вкладок отрисовано на сервере: весь текст статьи есть в HTML */
  panels: Record<string, ReactNode>;
}

// Вкладки по WAI-ARIA: стрелки, Home и End переключают и переводят фокус,
// выбранная вкладка хранится в адресе (?pos=verb)
export function EntryTabs({ tabs, panels }: Props) {
  const requested = useSearchParam('pos');
  const defaultId = tabs[0].id;
  const active = tabs.some(tab => tab.id === requested)
    ? (requested as string)
    : defaultId;
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string) => {
    // Фильтр тематик у каждой части речи свой, поэтому при смене вкладки сбрасывается
    setSearchParams({ pos: id === defaultId ? null : id, s: null });
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const { id } = tabs[next];
    select(id);
    buttons.current[id]?.focus();
  };

  return (
    <>
      <div
        id="entry-tabs"
        className={styles.tabs}
        role="tablist"
        aria-label="Разделы статьи"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={element => {
              buttons.current[tab.id] = element;
            }}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            className={styles.tab}
            onClick={() => select(tab.id)}
            onKeyDown={event => onKeyDown(event, index)}
          >
            {tab.label} <span className={styles.tabCount}>{tab.count}</span>
          </button>
        ))}
      </div>

      {tabs.map(tab => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={active !== tab.id}
        >
          {panels[tab.id]}
        </div>
      ))}
    </>
  );
}
