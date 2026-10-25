import styles from './ConceptBar.module.css';

// Пометка на каждой странице: это концепт, а не настоящий сайт.
// aside с подписью — отдельная область: её видно и при навигации
// скринридера по областям страницы
export function ConceptBar() {
  return (
    <aside aria-label="О сайте">
      <p className={styles.bar}>
        <b>Неофициальный концепт редизайна.</b> Не связан с Мультитраном, данные
        в примерах учебные.
      </p>
    </aside>
  );
}
