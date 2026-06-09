import { client } from "../lib/cassandra";
import redis from "../lib/redis";

// 24 hours
const CACHE_TTL = 60 * 60 * 24;

const cacheKey = (shortcode: string) => `url:${shortcode}`;

export interface UrlRecord {
  shortcode: string;
  longUrl: string;
  createdAt: Date;
}

export const urlRepository = {
  async save(shortcode: string, longUrl: string): Promise<void> {
    await client.execute(
      `INSERT INTO url (shortcode, long_url, created_at)
       VALUES (?, ?, toTimestamp(now()))`,
      [shortcode, longUrl],
      { prepare: true },
    );
  },

  async findByShortcode(shortcode: string): Promise<string | null> {
    const key = cacheKey(shortcode);

    const cached = await redis.get(key);
    if (cached) {
      console.log(`[cache] HIT  ${shortcode}`);
      return cached;
    }

    console.log(`[cache] MISS ${shortcode} — searching on Cassandra`);

    const result = await client.execute(
      "SELECT long_url FROM url WHERE shortcode = ?",
      [shortcode],
      { prepare: true },
    );

    if (result.rowLength === 0) return null;

    const longUrl: string = result.rows[0].long_url;

    await redis.setex(key, CACHE_TTL, longUrl);

    return longUrl;
  },

  async exists(shortcode: string): Promise<boolean> {
    const result = await client.execute(
      "SELECT shortcode FROM url WHERE shortcode = ?",
      [shortcode],
      { prepare: true },
    );
    return result.rowLength > 0;
  },
};
