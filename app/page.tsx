import Link from 'next/link';

import { PageShell } from '@/components/layout/PageShell';

import styles from './page.module.css';

// Главная по макету появится на этапе 5
export default function HomePage() {
  return (
    <PageShell>
      <section className={`container ${styles.hero}`}>
        <h1 className={styles.title}>Термины и переводы по тематикам</h1>
        <p className={styles.sub}>
          Многоязычный словарь, который пополняют переводчики: от общей лексики
          до авиации, медицины и права.
        </p>
        <p className={styles.stage}>
          Концепт в работе: готова{' '}
          <Link className={styles.link} href="/en-ru/approach/">
            страница слова approach
          </Link>
        </p>
      </section>
    </PageShell>
  );
}
