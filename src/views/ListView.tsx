import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../state/SearchContext';
import type { SortDirection, SortKey } from '../types';
import styles from './ListView.module.css';

export default function ListView() {
  const { query, setQuery, items, loading, error } = useSearch();
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [direction, setDirection] = useState<SortDirection>('asc');

  const visible = useMemo(() => {
    const needle = filter.trim().toLowerCase();

    const filtered = needle
      ? items.filter(
          (item) =>
            item.title.toLowerCase().includes(needle) ||
            item.center.toLowerCase().includes(needle)
        )
      : items;

    const sorted = [...filtered].sort((a, b) => {
      let result = 0;

      if (sortKey === 'date') {
        result = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        result = a[sortKey].localeCompare(b[sortKey]);
      }

      return direction === 'asc' ? result : -result;
    });

    return sorted;
  }, [items, filter, sortKey, direction]);

  return (
    <section>
      <h1 className={styles.heading}>Search the archive</h1>
      <p className={styles.lede}>
        Query NASA&rsquo;s public image library
      </p>

      <div className={styles.controls}>
        <label className={styles.field}>
          <span className={styles.label}>Search NASA</span>
          <input
            className={styles.input}
            type="search"
            value={query}
            placeholder="apollo, nebula, mars rover…"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Filter results</span>
          <input
            className={styles.input}
            type="search"
            value={filter}
            placeholder="type to narrow"
            onChange={(event) => setFilter(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Sort by</span>
          <select
            className={styles.select}
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
          >
            <option value="title">Title</option>
            <option value="date">Date</option>
            <option value="center">Center</option>
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Order</span>
          <select
            className={styles.select}
            value={direction}
            onChange={(event) => setDirection(event.target.value as SortDirection)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {loading && <p className={styles.status}>Loading…</p>}
      {error && !loading && <p className={styles.status}>{error}</p>}

      {!loading && !error && (
        <>
          <p className={styles.count}>
            {visible.length} of {items.length} results
          </p>

          <ul className={styles.list}>
            {visible.map((item) => (
              <li key={item.id}>
                <Link to={`/item/${encodeURIComponent(item.id)}`} className={styles.row}>
                  <img className={styles.thumb} src={item.thumbnail} alt="" loading="lazy" />
                  <div className={styles.text}>
                    <h2 className={styles.title}>{item.title}</h2>
                    <p className={styles.meta}>
                      {item.center} &middot; {item.date.slice(0, 10)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}