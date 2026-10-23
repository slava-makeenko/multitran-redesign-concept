import Link from 'next/link';

import { NavLinks } from './NavLinks';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.row}`}>
        <Link
          className={styles.logo}
          href="/"
          aria-label="Мультитран — на главную"
        >
          <span className={styles.mark} aria-hidden="true">
            м
          </span>
          мультитран
        </Link>
        <NavLinks />
        <span className={styles.spacer} />
        <Link className={styles.login} href="/about/#not-implemented">
          Войти
        </Link>
      </div>
    </header>
  );
}
