import Link from 'next/link';

import { PageShell } from '@/components/layout/PageShell';
import { SearchBox } from '@/components/search/SearchBox';
import { AdSlot } from '@/components/ui/AdSlot';
import { ChevronRightIcon } from '@/components/ui/icons';
import { MorphLink } from '@/components/ui/MorphLink';
import ui from '@/components/ui/ui.module.css';
import { FORUM_NOW, POPULAR_PAIRS } from '@/data/home';
import {
  ENTRIES,
  entryHref,
  PAIRS,
  SUBJECTS,
  subjectLinks,
} from '@/lib/dictionary';
import { count, REPLY_FORMS } from '@/lib/plural';

import styles from './page.module.css';

const NOT_IMPLEMENTED = '/about/#not-implemented';

function SectionHead({
  id,
  title,
  link,
}: {
  id: string;
  title: string;
  link: string;
}) {
  return (
    <div className={styles.sectionHead}>
      <h2 id={id} className={styles.sectionTitle}>
        {title}
      </h2>
      <Link className={styles.sectionLink} href={NOT_IMPLEMENTED}>
        {link}
      </Link>
    </div>
  );
}

export default function HomePage() {
  const subjects = subjectLinks();
  const topics = FORUM_NOW.flatMap(({ slug, subject, ago, answered }) => {
    const entry = ENTRIES.find(item => item.slug === slug);
    const [topic] = entry?.forum ?? [];
    return entry && topic
      ? [{ entry, topic, meta: `${SUBJECTS[subject]} · ${ago}`, answered }]
      : [];
  });

  return (
    <PageShell>
      <div className="container">
        <section className={styles.hero} aria-labelledby="home-title">
          <h1 id="home-title" className={styles.title}>
            Термины и переводы <br className="only-desktop" />
            по тематикам
          </h1>
          <p className={styles.sub}>
            Многоязычный словарь, который пополняют переводчики: от общей
            лексики до авиации, медицины и права.
          </p>

          <div className={styles.search}>
            <SearchBox pair="en-ru" size="lg" />
            <div className={styles.examples}>
              <span className={styles.examplesLabel}>Например:</span>
              {ENTRIES.map(entry => (
                <MorphLink
                  key={entry.slug}
                  className={`${ui.chip} ${ui.chipLine}`}
                  href={entryHref(entry)}
                  lang={PAIRS[entry.pair].sourceLang}
                >
                  {entry.word}
                </MorphLink>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="home-pairs">
          <SectionHead
            id="home-pairs"
            title="Популярные словари"
            link="Все языки"
          />
          <ul className={styles.pairs}>
            {POPULAR_PAIRS.map(pair => (
              <li key={pair.name}>
                <Link
                  className={styles.pairCard}
                  href={pair.href ?? NOT_IMPLEMENTED}
                >
                  <span className={styles.flags} aria-hidden="true">
                    {pair.codes.map((code, index) => (
                      <span
                        key={code}
                        className={styles.flag}
                        style={{ background: pair.colors[index] }}
                      >
                        {code}
                      </span>
                    ))}
                  </span>
                  <span className={styles.pairText}>
                    <span className={styles.pairName}>{pair.name}</span>
                    <span className={styles.pairMeta}>{pair.meta}</span>
                  </span>
                  <ChevronRightIcon size={20} className={styles.arrow} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <AdSlot size="leader" />

        <section className={styles.section} aria-labelledby="home-subjects">
          <SectionHead
            id="home-subjects"
            title="Тематики"
            link="Все тематики"
          />
          <ul className={styles.chips}>
            {subjects.map(item => (
              <li key={item.subject}>
                <Link className={ui.chip} href={item.href}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="home-forum">
          <SectionHead
            id="home-forum"
            title="Сейчас обсуждают на форуме"
            link="Форум"
          />
          <ul className={styles.forum}>
            {topics.map(({ entry, topic, meta, answered }) => (
              <li key={topic.title}>
                <Link
                  className={styles.forumItem}
                  href={entryHref(entry, 'forum')}
                >
                  <span className={styles.forumText}>
                    <span className={styles.forumTitle}>{topic.title}</span>
                    <span className={styles.forumMeta}>{meta}</span>
                  </span>
                  <span
                    className={`${styles.badge} ${answered ? styles.badgeOk : ''}`}
                  >
                    {answered
                      ? 'Есть ответ'
                      : count(topic.replies, REPLY_FORMS)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
