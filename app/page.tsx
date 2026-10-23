import styles from './page.module.css';

// Этап 1: каркас. Главная по макету появится на этапе 5.
export default function HomePage() {
  return (
    <section className={`container ${styles.hero}`}>
      <h1 className={styles.title}>Термины и переводы по тематикам</h1>
      <p className={styles.sub}>
        Многоязычный словарь, который пополняют переводчики: от общей лексики до
        авиации, медицины и права.
      </p>
      <p className={styles.stage}>Каркас концепта: этап 1 из 8</p>
    </section>
  );
}
