'use client';

import { useEffect, useState } from 'react';

import { TOAST_EVENT } from './toast';
import styles from './Toaster.module.css';

const VISIBLE_MS = 2000;

// Один регион для всех уведомлений: role="status" — скринридер прочитает текст
export function Toaster() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    let timer: number | undefined;
    const handle = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMessage(''), VISIBLE_MS);
    };
    window.addEventListener(TOAST_EVENT, handle);
    return () => {
      window.removeEventListener(TOAST_EVENT, handle);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {message && <div className={styles.toast}>{message}</div>}
    </div>
  );
}
