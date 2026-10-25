import Link from 'next/link';

import styles from './Footer.module.css';

const LINKS = [
  { href: '/en-ru/', label: 'Словари' },
  { href: '/about/#not-implemented', label: 'Форум' },
  { href: '/about/', label: 'О концепте' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.row}`}>
        <span>
          Концепт редизайна для портфолио. Названия и данные принадлежат
          правообладателям.
        </span>
        <nav aria-label="Ссылки в подвале">
          <ul className={styles.links}>
            {LINKS.map(link => (
              <li key={link.label}>
                <Link className={styles.link} href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
