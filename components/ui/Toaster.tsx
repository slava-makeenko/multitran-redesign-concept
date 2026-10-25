'use client';

import { useEffect, useState } from 'react';

import { TOAST_EVENT } from './toast';
import styles from './Toaster.module.css';

const VISIBLE_MS = 2000;

interface Toast {
  /** Новый id — новый элемент: анимация появления запускается заново */
  id: number;
  message: string;
  leaving: boolean;
}

// Один регион для всех уведомлений: role="status" — скринридер прочитает текст.
// Уведомление выезжает снизу и уходит вниз; убирается, когда закончилась
// анимация ухода
export function Toaster() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    let id = 0;
    const handle = (event: Event) => {
      id += 1;
      setToast({
        id,
        message: (event as CustomEvent<string>).detail,
        leaving: false,
      });
      window.clearTimeout(timer);
      timer = window.setTimeout(
        () => setToast(current => current && { ...current, leaving: true }),
        VISIBLE_MS,
      );
    };
    window.addEventListener(TOAST_EVENT, handle);
    return () => {
      window.removeEventListener(TOAST_EVENT, handle);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toast && (
        <div
          key={toast.id}
          className={styles.toast}
          data-leaving={toast.leaving || undefined}
          onAnimationEnd={() => {
            if (toast.leaving) setToast(null);
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
