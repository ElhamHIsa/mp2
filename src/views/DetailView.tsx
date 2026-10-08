import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAssetUrls, getItemById } from '../api/nasa';
import { useSearch } from '../state/SearchContext';
import type { MediaItem } from '../types';
import styles from './DetailView.module.css';

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items } = useSearch();

  const [item, setItem] = useState<MediaItem | null>(null);
  const [fullImage, setFullImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const index = items.findIndex((candidate) => candidate.id === id);

  useEffect(() => {
    if (!id) return;
    let active = true;

    setLoading(true);
    setError(null);
    setFullImage('');

    const known = items.find((candidate) => candidate.id === id);

    const load = known ? Promise.resolve(known) : getItemById(id);

    load
      .then((result) => {
        if (!active) return;
        if (!result) {
          setError('That item could not be found.');
          return;
        }
        setItem(result);
        return getAssetUrls(id).then((urls) => {
          if (active && urls.length > 0) setFullImage(urls[0]);
        });
      })
      .catch(() => {
        if (active) setError('Could not load this item.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, items]);

  function go(offset: number) {
    if (items.length === 0) return;
    const next = (index + offset + items.length) % items.length;
    navigate(`/item/${encodeURIComponent(items[next].id)}`);
  }

  if (loading) return <p className={styles.status}>Loading…</p>;
  if (error || !item) {
    return (
      <div>
        <p className={styles.status}>{error ?? 'Not found.'}</p>
        <Link to="/" className={styles.back}>
          Back to search
        </Link>
      </div>
    );
  }

  return (
    <article className={styles.detail}>
      <Link to="/" className={styles.back}>
        &larr; Back to search
      </Link>

      <div className={styles.frame}>
        <img src={fullImage || item.thumbnail} alt={item.title} />
      </div>

      <div className={styles.body}>
        <h1 className={styles.title}>{item.title}</h1>

        <dl className={styles.facts}>
          <div>
            <dt>Center</dt>
            <dd>{item.center}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{item.date ? item.date.slice(0, 10) : 'Unknown'}</dd>
          </div>
          <div>
            <dt>Photographer</dt>
            <dd>{item.photographer || 'Not credited'}</dd>
          </div>
          <div>
            <dt>NASA ID</dt>
            <dd className={styles.mono}>{item.id}</dd>
          </div>
        </dl>

        {item.description && <p className={styles.description}>{item.description}</p>}

        {item.keywords.length > 0 && (
          <ul className={styles.keywords}>
            {item.keywords.slice(0, 12).map((keyword) => (
              <li key={keyword}>{keyword}</li>
            ))}
          </ul>
        )}
      </div>

      <nav className={styles.pager}>
        <button type="button" onClick={() => go(-1)} disabled={index === -1}>
          &larr; Previous
        </button>
        <span className={styles.position}>
          {index === -1 ? 'Not in current results' : `${index + 1} of ${items.length}`}
        </span>
        <button type="button" onClick={() => go(1)} disabled={index === -1}>
          Next &rarr;
        </button>
      </nav>
    </article>
  );
}