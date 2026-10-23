import type { Metadata } from 'next';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'О концепте',
};

export default function AboutPage() {
  return (
    <article className={`container ${styles.page}`}>
      <h1 className={styles.title}>О концепте</h1>
      <p>
        Это неофициальный концепт редизайна словаря Мультитран, сделанный для
        портфолио. Он не связан с Мультитраном. Статьи, примеры и ники авторов —
        учебные, составлены для концепта.
      </p>

      <h2 id="not-implemented" className={styles.subtitle}>
        Что в концепте не реализовано
      </h2>
      <ul className={styles.list}>
        <li>Форум и вход в аккаунт</li>
        <li>Добавление перевода</li>
        <li>Словари, кроме нескольких учебных статей</li>
      </ul>
    </article>
  );
}
