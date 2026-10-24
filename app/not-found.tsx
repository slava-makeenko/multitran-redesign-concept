import Link from 'next/link';

import { PageShell } from '@/components/layout/PageShell';

import styles from './about/page.module.css';

export default function NotFound() {
  return (
    <PageShell>
      <article className={`container ${styles.page}`}>
        <h1 className={styles.title}>Страница не найдена</h1>
        <p>
          В концепте всего несколько учебных статей. Начните с поиска на{' '}
          <Link className={styles.link} href="/">
            главной
          </Link>
          .
        </p>
      </article>
    </PageShell>
  );
}
