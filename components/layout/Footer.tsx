import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.row}`}>
        <span>
          Концепт редизайна для портфолио. Названия и данные принадлежат
          правообладателям.
        </span>
      </div>
    </footer>
  );
}
