'use client';

import Form from 'next/form';
import { usePathname, useRouter } from 'next/navigation';
import {
  useEffect,
  useId,
  useRef,
  useState,
  ViewTransition,
  type FormEvent,
  type KeyboardEvent,
} from 'react';

import {
  ClockIcon,
  PhraseIcon,
  SearchIcon,
  SwapIcon,
} from '@/components/ui/icons';
import { morphName, otherPair, PAIRS } from '@/lib/dictionary';
import { count, SUGGESTION_FORMS } from '@/lib/plural';
import {
  didYouMean,
  normalizeQuery,
  searchPair,
  suggest,
  type SearchIndex,
  type SearchItem,
} from '@/lib/search';
import {
  addToHistory,
  clearHistory,
  readHistory,
  whenSearched,
  type HistoryItem,
} from '@/lib/search-history';
import type { PairId } from '@/lib/types';
import { setSearchParams } from '@/lib/url-state';

import styles from './SearchBox.module.css';

interface Props {
  pair: PairId;
  /** Индекс поиска собран при сборке; см. components/search/Search.tsx */
  index: SearchIndex;
  defaultValue?: string;
  /** lg — большой поиск на главной: полные названия языков и кнопка «Найти» */
  size?: 'md' | 'lg';
}

interface Option {
  key: string;
  item: SearchItem;
  icon: 'search' | 'phrase' | 'clock';
  /** Совпавшая часть текста подсвечивается */
  match?: [number, number];
  /** Справа: перевод или «вы искали вчера» */
  hint: string;
  hintIsTranslation: boolean;
}

const ICONS = { search: SearchIcon, phrase: PhraseIcon, clock: ClockIcon };

const trimSlash = (path: string) => path.replace(/\/+$/, '');

function Highlight({
  text,
  match,
}: {
  text: string;
  match?: [number, number];
}) {
  if (!match) return text;
  const [start, end] = match;
  return (
    <>
      {text.slice(0, start)}
      <mark>{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}

// Комбобокс по WAI-ARIA 1.2: фокус остаётся в поле, активная подсказка
// передаётся через aria-activedescendant. Без JS форма ведёт на /search/.
export function SearchBox({
  pair: initialPair,
  index: searchIndex,
  defaultValue = '',
  size = 'md',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [pair, setPair] = useState(initialPair);
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [status, setStatus] = useState('');

  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const large = size === 'lg';
  const { name, ...labels } = PAIRS[pair];
  const source = large ? labels.sourceName : labels.source;
  const target = large ? labels.targetName : labels.target;
  const typing = normalizeQuery(query).length >= 2;

  // До двух символов — история, дальше — подсказки; без совпадений — ближайшее
  // слово с опечаткой
  let options: Option[];
  let message = '';
  if (!typing) {
    options = history.map(item => ({
      key: `history:${item.href}:${item.text}`,
      item: { kind: 'entry', ...item },
      icon: 'clock',
      hint: `вы искали ${whenSearched(item.at)}`,
      hintIsTranslation: false,
    }));
  } else {
    const visited = new Set(history.map(item => item.href + item.text));
    options = suggest(searchIndex, query, pair).map(item => ({
      key: `${item.kind}:${item.text}`,
      item,
      icon: visited.has(item.href + item.text)
        ? 'clock'
        : item.kind === 'phrase'
          ? 'phrase'
          : 'search',
      match: item.match,
      hint: item.hint,
      hintIsTranslation: true,
    }));
    if (!options.length) {
      const guess = didYouMean(searchIndex, query, pair);
      message = guess
        ? 'Точных совпадений нет. Возможно, вы искали:'
        : 'Ничего не найдено';
      if (guess) {
        options = [
          {
            key: 'guess',
            item: guess,
            icon: 'search',
            hint: guess.hint,
            hintIsTranslation: true,
          },
        ];
      }
    }
  }
  const showPopup = open && (options.length > 0 || message !== '');

  // Активная подсказка всегда в видимой части списка
  useEffect(() => {
    if (active >= 0) {
      document
        .getElementById(`${id}-option-${active}`)
        ?.scrollIntoView({ block: 'nearest' });
    }
  }, [active, id]);

  const openPopup = () => {
    setHistory(readHistory());
    setOpen(true);
  };

  const announce = (value: string, nextPair: PairId, pairChanged: boolean) => {
    const parts = pairChanged ? [PAIRS[nextPair].name] : [];
    if (normalizeQuery(value).length >= 2) {
      const found = suggest(searchIndex, value, nextPair).length;
      parts.push(found ? count(found, SUGGESTION_FORMS) : 'ничего не найдено');
    }
    setStatus(parts.join('. '));
  };

  const onChange = (value: string) => {
    // Направление следует за алфавитом: кириллица — RU → EN, латиница — EN → RU
    const nextPair = searchPair(value, pair);
    setQuery(value);
    setPair(nextPair);
    setActive(-1);
    openPopup();
    announce(value, nextPair, nextPair !== pair);
  };

  const swap = () => {
    const nextPair = otherPair(pair);
    setPair(nextPair);
    setActive(-1);
    announce(query, nextPair, true);
  };

  const isCurrentPage = (href: string) =>
    trimSlash(href.split('?')[0]) === trimSlash(pathname);

  const choose = (item: SearchItem) => {
    addToHistory(item);
    if (!isCurrentPage(item.href)) {
      // Подсказки не закрываем: выбранное слово «перелетает» в заголовок
      // статьи (View Transitions), а поле уходит вместе со старой страницей
      router.push(item.href);
      return;
    }
    // Та же статья: страница не перерисуется, вкладку переключаем сами
    setQuery(item.text);
    setPair(item.pair);
    setOpen(false);
    setActive(-1);
    const search = item.href.split('?')[1] ?? '';
    setSearchParams({ pos: new URLSearchParams(search).get('pos'), s: null });
    document.getElementById('entry-tabs')?.scrollIntoView({ block: 'start' });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!query.trim()) {
      event.preventDefault();
      setOpen(false);
      inputRef.current?.focus();
      return;
    }
    // Enter без выбора открывает первую подсказку — она подсвечена в списке.
    // Если подсказок нет, Form переходит на /search/?q=…&pair=…
    const [first] = suggest(searchIndex, query, pair, 1);
    if (first) {
      event.preventDefault();
      choose(first);
    } else {
      setOpen(false);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      if (!showPopup) {
        openPopup();
        return;
      }
      const last = options.length - 1;
      if (last < 0) return;
      setActive(current =>
        key === 'ArrowDown'
          ? current >= last
            ? 0
            : current + 1
          : current <= 0
            ? last
            : current - 1,
      );
    } else if (key === 'Enter' && showPopup && active >= 0) {
      event.preventDefault();
      choose(options[active].item);
    } else if (key === 'Escape') {
      // Первый Esc закрывает подсказки, второй очищает поле
      if (showPopup) {
        event.preventDefault();
        setOpen(false);
        setActive(-1);
      } else if (query) {
        event.preventDefault();
        setQuery('');
      }
    }
  };

  const onClear = () => {
    clearHistory();
    setHistory([]);
    setStatus('История поиска очищена');
    inputRef.current?.focus();
  };

  return (
    <div
      className={styles.root}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setActive(-1);
        }
      }}
    >
      <Form
        action="/search/"
        className={`${styles.search} ${large ? styles.large : ''}`}
        role="search"
        onSubmit={onSubmit}
      >
        <div className={styles.pair}>
          <span className={styles.lang} aria-hidden="true">
            {source}
          </span>
          <button
            type="button"
            className={styles.swap}
            aria-label="Поменять языки местами"
            data-flipped={pair === 'ru-en'}
            onClick={swap}
          >
            <SwapIcon size={16} />
          </button>
          <span className={styles.lang} aria-hidden="true">
            {target}
          </span>
        </div>
        <label className="visually-hidden" htmlFor={`${id}-input`}>
          Что перевести
        </label>
        <span id={`${id}-pair`} className="visually-hidden">
          {name}
        </span>
        <input
          ref={inputRef}
          id={`${id}-input`}
          className={styles.input}
          name="q"
          type="search"
          enterKeyHint="search"
          placeholder={large ? 'Слово, термин или фраза' : 'Слово или фраза'}
          lang={PAIRS[pair].sourceLang}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showPopup}
          aria-controls={listId}
          aria-activedescendant={
            showPopup && active >= 0 ? optionId(active) : undefined
          }
          aria-describedby={`${id}-pair`}
          value={query}
          onChange={event => onChange(event.target.value)}
          onFocus={() => {
            if (query.trim()) setHistory(readHistory());
            else openPopup();
          }}
          onKeyDown={onKeyDown}
        />
        <input type="hidden" name="pair" value={pair} />
        <button
          type="submit"
          className={styles.submit}
          aria-label={large ? undefined : 'Найти'}
        >
          {large ? 'Найти' : <SearchIcon size={18} />}
        </button>
      </Form>

      {/* mousedown не уводит фокус из поля: клик по подсказке её выбирает */}
      <div
        className={styles.popup}
        hidden={!showPopup}
        onMouseDown={event => event.preventDefault()}
      >
        {!typing && (
          <div className={styles.popupHead}>
            <span>Недавние запросы</span>
            <button type="button" className={styles.clear} onClick={onClear}>
              Очистить
            </button>
          </div>
        )}
        {message && <p className={styles.message}>{message}</p>}
        <ul
          id={listId}
          role="listbox"
          aria-label={typing ? 'Подсказки' : 'Недавние запросы'}
          className={styles.list}
        >
          {options.map((option, index) => {
            const Icon = ICONS[option.icon];
            const { sourceLang, targetLang } = PAIRS[option.item.pair];
            return (
              <li
                key={option.key}
                id={optionId(index)}
                role="option"
                aria-selected={index === active}
                // Подсвечена подсказка, которую откроет Enter без выбора
                data-default={
                  typing && active === -1 && index === 0 ? '' : undefined
                }
                className={styles.option}
                onClick={() => choose(option.item)}
              >
                <Icon size={18} className={styles.optionIcon} />
                {/* Слово статьи «перелетает» в её заголовок. У текущей статьи
                    имя не ставим: заголовок с тем же именем уже на странице */}
                <ViewTransition
                  name={
                    isCurrentPage(option.item.href)
                      ? undefined
                      : morphName(option.item.href)
                  }
                  share="morph"
                  default="none"
                >
                  <span className={styles.optionText} lang={sourceLang}>
                    <Highlight text={option.item.text} match={option.match} />
                  </span>
                </ViewTransition>
                <span
                  className={styles.optionHint}
                  lang={option.hintIsTranslation ? targetLang : undefined}
                >
                  {option.hint}
                </span>
              </li>
            );
          })}
        </ul>
        <div className={styles.keys} aria-hidden="true">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> выбрать
          </span>
          <span>
            <kbd>Enter</kbd> открыть
          </span>
          <span>
            <kbd>Esc</kbd> закрыть
          </span>
        </div>
      </div>

      <p className="visually-hidden" role="status">
        {status}
      </p>
    </div>
  );
}
