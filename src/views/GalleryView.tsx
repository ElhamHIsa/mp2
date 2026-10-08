import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../state/SearchContext';
import styles from './GalleryView.module.css';

export default function GalleryView() {
  const { query, items, loading, error } = useSearch();
  const [selected, setSelected] = useState<string[]>([]);

  const centers = useMemo(() => {
    const unique = new Set(items.map((item) => item.center));
    return [...unique].sort();
  }, [items]);

  const visible = useMemo(
    () => (selected.length === 0 ? items : items.filter((item) => selected.includes(item.center))),
    [items, selected]
  );

  function toggle(center: string) {
    setSelected((current) =>
      current.includes(center) ? current.filter((c) => c !== center) : [...current, center]
    );
  }

  return (
    <section>
      <h1 className={styles.heading}>Gallery</h1>
      <p className={styles.lede}>
        Results for &ldquo;{query}&rdquo;. Select one or more NASA centers to filter.
      </p>

      <div className={styles.filters}>
        {centers.map((center) => (
          <button
            key={center}
            type="button"
            className={selected.includes(center) ? `${styles.chip} ${styles.on}` : styles.chip}
            onClick={() => toggle(center)}
            aria-pressed={selected.includes(center)}
          >
            {center}
          </button>
        ))}

        {selected.length > 0 && (
          <button type="button" className={styles.clear} onClick={() => setSelected([])}>
            Clear filters
          </button>
        )}
      </div>

      {loading && <p className={styles.status}>Loading…</p>}
      {error && !loading && <p className={styles.status}>{error}</p>}

      {!loading && !error && (
        <>
          <p className={styles.status}>{visible.length} images</p>

          <div className={styles.grid}>
            {visible.map((item) => (
              <Link
                key={item.id}
                to={`/item/${encodeURIComponent(item.id)}`}
                className={styles.tile}
              >
                <img src={item.thumbnail} alt={item.title} loading="lazy" />
                <span className={styles.caption}>{item.title}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}