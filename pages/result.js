import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Gradebook.module.css';

export default function Result() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <Head>
        <title>Results · Stratford</title>
      </Head>
      <div className={`${styles.page} ${mounted ? styles.visible : ''}`}>
        <div className={styles.grid} aria-hidden="true" />

        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            STRATFORD
          </div>
          <h1 className={styles.title}>[placeholder]</h1>

          <button className={styles.back} onClick={() => router.push('/gradebook')}>
            ← Back to search
          </button>
        </div>
      </div>
    </>
  );
}
