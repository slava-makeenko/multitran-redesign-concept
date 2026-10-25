'use client';

import { useEffect, useState } from 'react';

import { useSearchParam } from '@/lib/url-state';

import styles from './AdSlot.module.css';

const DELAY_MS = 1000;

// Режим ?ads=sim для замера «после»: через секунду в слот приходит «реклама»,
// как от настоящей рекламной сети. Размер слота задан заранее, поэтому
// страница не сдвигается — это и проверяет CLS. Настоящие сети не подключаются.
export function AdFill() {
  const simulate = useSearchParam('ads') === 'sim';
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (!simulate) return;
    const timer = window.setTimeout(() => setFilled(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [simulate]);

  return filled ? (
    <span className={styles.fill}>Здесь могла быть ваша реклама</span>
  ) : null;
}
