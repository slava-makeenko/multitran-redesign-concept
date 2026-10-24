import { PAIRS } from '@/lib/dictionary';
import type { PairId } from '@/lib/types';
import { SearchIcon, SwapIcon } from '@/components/ui/icons';

import styles from './SearchBox.module.css';

interface Props {
  pair: PairId;
  defaultValue?: string;
}

// Этап 2: только внешний вид. Подсказки, история и смена пары — этап 4.
export function SearchBox({ pair, defaultValue = '' }: Props) {
  const { source, target } = PAIRS[pair];

  return (
    <form className={styles.search} role="search">
      <div className={styles.pair}>
        <span className={styles.lang}>{source}</span>
        <button
          type="button"
          className={styles.swap}
          aria-label="Поменять языки местами"
        >
          <SwapIcon size={16} />
        </button>
        <span className={styles.lang}>{target}</span>
      </div>
      <label className="visually-hidden" htmlFor="search-query">
        Что перевести
      </label>
      <input
        id="search-query"
        className={styles.input}
        name="q"
        type="search"
        defaultValue={defaultValue}
        autoComplete="off"
        spellCheck={false}
      />
      <button type="submit" className={styles.submit} aria-label="Найти">
        <SearchIcon size={18} />
      </button>
    </form>
  );
}
