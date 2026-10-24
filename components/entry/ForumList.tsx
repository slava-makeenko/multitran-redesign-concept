import Link from 'next/link';

import ui from '@/components/ui/ui.module.css';
import { count } from '@/lib/plural';
import type { ForumTopic } from '@/lib/types';

import styles from './entry.module.css';

const REPLY_FORMS: [string, string, string] = ['ответ', 'ответа', 'ответов'];

export function ForumList({ topics }: { topics: ForumTopic[] }) {
  return (
    <section
      className={`${styles.card} ${styles.listCard}`}
      aria-label="Обсуждения на форуме"
    >
      <ul>
        {topics.map(topic => (
          <li key={topic.title} className={styles.forumRow}>
            <Link className={styles.forumLink} href="/about/#not-implemented">
              {topic.title}
            </Link>
            <span className={styles.forumMeta}>
              {count(topic.replies, REPLY_FORMS)}
            </span>
          </li>
        ))}
      </ul>
      <Link
        className={`${ui.btn} ${ui.soft} ${styles.forumAsk}`}
        href="/about/#not-implemented"
      >
        Задать вопрос на форуме
      </Link>
    </section>
  );
}
