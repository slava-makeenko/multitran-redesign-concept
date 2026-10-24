import Link from 'next/link';

import { PageShell } from '@/components/layout/PageShell';
import { SearchBox } from '@/components/search/SearchBox';
import ui from '@/components/ui/ui.module.css';
import { ENTRIES, entryHref, PAIRS } from '@/lib/dictionary';

import styles from './page.module.css';

// Главная по макету появится на этапе 5; пока — заголовок, поиск и примеры
export default function HomePage() {
  return (
    <PageShell>
      <section className={`container ${styles.hero}`}>
        <h1 className={styles.title}>Термины и переводы по тематикам</h1>
        <p className={styles.sub}>
          Многоязычный словарь, который пополняют переводчики: от общей лексики
          до авиации, медицины и права.
        </p>

        <div className={styles.search}>
          <SearchBox pair="en-ru" />
          <div className={styles.examples}>
            <span className={styles.examplesLabel}>Например:</span>
            {ENTRIES.map(entry => (
              <Link
                key={entry.slug}
                className={`${ui.chip} ${ui.chipLine}`}
                href={entryHref(entry)}
                lang={PAIRS[entry.pair].sourceLang}
              >
                {entry.word}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
