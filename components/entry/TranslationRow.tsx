'use client';

import type { Ref } from 'react';

import { CopyIcon } from '@/components/ui/icons';
import { showToast } from '@/components/ui/toast';
import type { Translation } from '@/lib/types';

import styles from './entry.module.css';

interface Props {
  translation: Translation;
  sourceLang: string;
  targetLang: string;
  hidden?: boolean;
  /** Первая строка из раскрытых по «Показать ещё» получает фокус */
  rowRef?: Ref<HTMLLIElement>;
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Скопировано: ${text}`);
  } catch {
    // Буфер недоступен (например, без HTTPS) — подсказываем выделить вручную
    showToast('Не удалось скопировать — выделите текст вручную');
  }
}

export function TranslationRow({
  translation,
  sourceLang,
  targetLang,
  hidden,
  rowRef,
}: Props) {
  const { text, gloss, example, author } = translation;

  return (
    <li
      className={styles.tr}
      hidden={hidden}
      ref={rowRef}
      tabIndex={rowRef ? -1 : undefined}
    >
      <div className={styles.trMain}>
        <span className={styles.trText} lang={targetLang}>
          {text}
        </span>
        {gloss && <span className={styles.trGloss}> — {gloss}</span>}
        {example && (
          <p className={styles.trExample}>
            <i lang={sourceLang}>{example.source}</i> —{' '}
            <span lang={targetLang}>{example.target}</span>
          </p>
        )}
      </div>
      <div className={styles.trSide}>
        {author && <span className={styles.trAuthor}>{author}</span>}
        <button
          type="button"
          className={styles.copy}
          aria-label={`Копировать «${text}»`}
          onClick={() => copy(text)}
        >
          <CopyIcon size={16} />
        </button>
      </div>
    </li>
  );
}
