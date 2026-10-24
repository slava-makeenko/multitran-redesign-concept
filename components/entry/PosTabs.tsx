import { countItems, POS_LABELS } from '@/lib/dictionary';
import type { Entry } from '@/lib/types';

import styles from './entry.module.css';

// Этап 2: вкладки показаны, переключение и панели — этап 3
export function PosTabs({ entry }: { entry: Entry }) {
  const tabs = [
    ...entry.parts.map(part => ({
      id: part.id,
      label: POS_LABELS[part.id],
      count: countItems(part.groups),
    })),
    { id: 'phrases', label: 'Фразы', count: entry.phrases.length },
    { id: 'forum', label: 'Форум', count: entry.forum.length },
  ];

  return (
    <div
      id="entry-tabs"
      className={styles.tabs}
      role="tablist"
      aria-label="Разделы статьи"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={index === 0}
          className={styles.tab}
        >
          {tab.label} <span className={styles.tabCount}>{tab.count}</span>
        </button>
      ))}
    </div>
  );
}
