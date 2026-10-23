import styles from './ConceptBar.module.css';

// Пометка на каждой странице: это концепт, а не настоящий сайт
export function ConceptBar() {
  return (
    <p className={styles.bar}>
      <b>Неофициальный концепт редизайна.</b> Не связан с Мультитраном, данные в
      примерах учебные.
    </p>
  );
}
