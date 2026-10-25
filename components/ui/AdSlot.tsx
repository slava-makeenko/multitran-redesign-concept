import styles from './AdSlot.module.css';

// mobile — подпись, когда на телефоне слот другого размера
const SIZES = {
  rect: { className: styles.rect, label: '300 × 250', mobile: null },
  feed: { className: styles.feed, label: '320 × 100', mobile: null },
  leader: { className: styles.leader, label: '728 × 90', mobile: '320 × 100' },
} as const;

interface Props {
  size: keyof typeof SIZES;
  className?: string;
}

// Место под рекламу: размер задан заранее, поэтому загрузка рекламы
// не сдвигает страницу (CLS оригинала на телефоне — 0,123)
export function AdSlot({ size, className = '' }: Props) {
  const { className: sizeClass, label, mobile } = SIZES[size];
  return (
    <div
      className={`${styles.slot} ${sizeClass} ${className}`}
      aria-hidden="true"
      data-ad-slot={size}
    >
      <span>
        <b>Реклама</b>
        {mobile ? (
          <>
            <span className="only-desktop">{label}</span>
            <span className="only-mobile">{mobile}</span>
          </>
        ) : (
          label
        )}
      </span>
    </div>
  );
}
