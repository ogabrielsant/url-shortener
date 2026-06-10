import redis from "../lib/redis";
import { type UrlRecord, urlRepository } from "../repositories/url-repository";
import { salt, toBase62 } from "./hash-service";

const REDIS_COUNTER_KEY = "url:counter";
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3333";
const MAX_COLLISION_ATTEMPTS = 5;

export const urlService = {
  async shorten(longUrl: string): Promise<string> {
    const id = await redis.incr(REDIS_COUNTER_KEY);
    const shortcode = toBase62(BigInt(id));

    for (let attempt = 0; attempt <= MAX_COLLISION_ATTEMPTS; attempt++) {
      const candidate = attempt === 0 ? shortcode : salt(shortcode, attempt);

      const collision = await urlRepository.exists(candidate);

      if (!collision) {
        await urlRepository.save(candidate, longUrl);

        return `${BASE_URL}/${candidate}`;
      }

      console.warn(
        `[url-service] - collision detected with candidate "${candidate}" (attempt ${attempt})`,
      );
    }

    throw new Error(
      "Error while generating a new unique shortcode. Max attempts reached.",
    );
  },

  async resolve(shortcode: string): Promise<string | null> {
    return urlRepository.findByShortcode(shortcode);
  },

  async findAll(
    pageSize = 20,
    pagingState?: string,
  ): Promise<{ urls: UrlRecord[]; nextPage: string | null }> {
    return urlRepository.findAll(pageSize, pagingState);
  },
};
