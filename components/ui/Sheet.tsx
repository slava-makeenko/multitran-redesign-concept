'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';

import { CloseIcon } from './icons';
import styles from './Sheet.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

// Нижняя шторка на нативном <dialog>: браузер сам держит фокус внутри,
// закрывает по Esc, делает фон недоступным и возвращает фокус на кнопку
export function Sheet({ open, onClose, title, children, footer }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Esc и закрытие формой приходят событием close
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, [onClose]);

  // Пока шторка открыта, страница под ней не прокручивается
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.sheet}
      aria-labelledby={titleId}
      onClick={event => {
        // Клик по затемнению вокруг шторки
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.inner}>
        <div className={styles.grab} aria-hidden="true" />
        <div className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon size={22} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </dialog>
  );
}
