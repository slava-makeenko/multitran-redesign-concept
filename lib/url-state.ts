'use client';

import { useSyncExternalStore } from 'react';

// Состояние интерфейса в адресе (?pos=verb&s=aviation): ссылкой можно поделиться.
// Сервер и первый рендер видят пустой адрес — значения по умолчанию, поэтому
// статичный HTML и гидрация совпадают; после неё подтягивается реальный адрес.

const CHANGE_EVENT = 'mt:urlchange';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useSearchParam(name: string): string | null {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => '',
  );
  return new URLSearchParams(search).get(name);
}

/** Меняет параметры без перехода и истории: null удаляет параметр */
export function setSearchParams(update: Record<string, string | null>) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(update)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(window.history.state, '', url);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
