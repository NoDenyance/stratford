import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Gradebook.module.css';

export default function Gradebook() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => { setMounted(true); }, []);

  const handleSearch = () => {
    if (!name.trim()) return;
    router.push(`/result?name=${encodeURIComponent(name.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      <Head>
        <title>Gradebook · Stratford</title>
      </Head>
      <div className={`${styles.page} ${mounted ? styles.visible : ''}`}>
        <div className={styles.grid} aria-hidden="true" />

        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            CONNECTED
          </div>
          <h1 className={styles.title}>Gradebook</h1>

          <div className={styles.searchCard}>
            <label className={styles.searchLabel} htmlFor="studentName">
              Student Name
            </label>
            <input
              id="studentName"
              type="text"
              className={styles.searchInput}
              placeholder="Cyrano BurgerShack"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
            />
            <button
              className={`${styles.searchBtn} ${name.trim() ? styles.searchBtnActive : ''}`}
              onClick={handleSearch}
            >
              Find Grades
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <div className={styles.examples}>
            <p className={styles.examplesTitle}>e.g.</p>
            <p>Aarav Partani: Math: Trimester 1: 75.23%</p>
            <p>Aarav Partani: Math: Trimester 2: 75.45%</p>
            <p>Aarav Partani: English: Trimester 1: 65%</p>
          </div>

          <button className={styles.back} onClick={() => router.push('/')}>
            ← Back to login
          </button>
        </div>
      </div>
    </>
  );
}
