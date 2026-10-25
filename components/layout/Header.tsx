import Link from 'next/link';
import type { ReactNode } from 'react';

import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';
import styles from './Header.module.css';

interface Props {
  search?: ReactNode;
}

export function Header({ search }: Props) {
  return (
    <header className={styles.header}>
      <div
        className={`container ${styles.row} ${search ? styles.withSearch : ''}`}
      >
        {/* Имя ссылки — видимый текст «мультитран» (WCAG 2.5.3). Буква в
            значке нарисована в CSS, чтобы не попадать в видимый текст ссылки */}
        <Link className={styles.logo} href="/">
          <span className={styles.mark} aria-hidden="true" />
          мультитран
        </Link>
        {/* Один и тот же поиск: на десктопе в строке шапки, на телефоне второй строкой */}
        {search && <div className={styles.search}>{search}</div>}
        <NavLinks />
        <span className={styles.spacer} />
        <Link className={styles.login} href="/about/#not-implemented">
          Войти
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}
