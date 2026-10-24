import type { ReactNode } from 'react';

import { Header } from './Header';

interface Props {
  /** Поиск в шапке — на страницах слов; на главной он в первом экране */
  search?: ReactNode;
  children: ReactNode;
}

export function PageShell({ search, children }: Props) {
  return (
    <>
      <Header search={search} />
      <main id="content">{children}</main>
    </>
  );
}
