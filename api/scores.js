// Global leaderboard for Drone Invaders, stored in Upstash Redis (add it from the Vercel Marketplace;
// it sets KV_REST_API_URL / KV_REST_API_TOKEN). Talks to Upstash's REST API, so no dependencies.
//   GET  /api/scores                    -> { top: [{ name, score }] }
//   POST /api/scores { name, score }    -> { top, rank }   (rank is 1-based, null if outside the kept list)

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'drones:scores';
const TOP = 10;        // entries returned to the game
const KEEP = 100;      // entries kept in Redis
const MAX_SCORE = 999990;
const COOLDOWN_S = 10; // one submission per IP every 10 seconds

async function redis(commands) {
  const r = await fetch(`${URL_}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error(`Upstash ${r.status}`);
  const out = await r.json();
  const err = out.find(x => x.error);
  if (err) throw new Error(err.error);
  return out.map(x => x.result);
}

// members are "NAME|uniqueid" so the same initials can appear more than once
const parseTop = flat => {
  const top = [];
  for (let i = 0; i < flat.length; i += 2) top.push({ name: String(flat[i]).split('|')[0], score: Number(flat[i + 1]) });
  return top;
};
const topCmd = ['ZRANGE', KEY, 0, TOP - 1, 'REV', 'WITHSCORES'];

module.exports = async (req, res) => {
  if (!URL_ || !TOKEN) return res.status(503).json({ error: 'leaderboard not configured' });
  try {
    if (req.method === 'GET') {
      const [flat] = await redis([topCmd]);
      res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=30');
      return res.status(200).json({ top: parseTop(flat) });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const name = String(body.name || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
      const score = Number(body.score);
      // every way to score in the game is a multiple of 10
      if (!name || !Number.isInteger(score) || score <= 0 || score > MAX_SCORE || score % 10)
        return res.status(400).json({ error: 'invalid name or score' });

      const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
      const [allowed] = await redis([['SET', `drones:rl:${ip}`, '1', 'NX', 'EX', COOLDOWN_S]]);
      if (allowed !== 'OK') return res.status(429).json({ error: 'too many submissions' });

      const member = `${name}|${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
      const [, , rank, flat] = await redis([
        ['ZADD', KEY, score, member],
        ['ZREMRANGEBYRANK', KEY, 0, -(KEEP + 1)],
        ['ZREVRANK', KEY, member],
        topCmd,
      ]);
      return res.status(200).json({ top: parseTop(flat), rank: rank == null ? null : rank + 1 });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(502).json({ error: 'leaderboard unavailable' });
  }
};
