'use client';

import type { ReactNode } from 'react';

import { setSearchParams } from '@/lib/url-state';

interface Props {
  tab: string;
  className?: string;
  children: ReactNode;
}

// Ссылка на вкладку статьи: без JS работает как обычная ссылка с ?pos=
export function TabLink({ tab, className, children }: Props) {
  return (
    <a
      className={className}
      href={`?pos=${tab}#entry-tabs`}
      onClick={event => {
        event.preventDefault();
        setSearchParams({ pos: tab, s: null });
        // Отступ под липкую шапку задаёт scroll-margin-top у списка вкладок;
        // на телефоне список ещё и прокручивается вбок до нужной вкладки
        const tabButton = document.getElementById(`tab-${tab}`);
        document
          .getElementById('entry-tabs')
          ?.scrollIntoView({ block: 'start' });
        tabButton?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        tabButton?.focus({ preventScroll: true });
      }}
    >
      {children}
    </a>
  );
}
