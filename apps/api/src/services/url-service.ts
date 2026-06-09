import redis from "../lib/redis";
import { urlRepository } from "../repositories/url-repository";
import { salt, toBase62 } from "./hash-service";

const REDIS_COUNTER_KEY = "url:counter";
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3333";
const MAX_COLLISION_ATTEMPTS = 5;

export const urlService = {
  async shorten(longUrl: string): Promise<string> {
    const id = await redis.incr(REDIS_COUNTER_KEY);

    let shortcode = toBase62(BigInt(id));

    for (let attempt = 0; attempt <= MAX_COLLISION_ATTEMPTS; attempt++) {
      const candidate = attempt === 0 ? shortcode : salt(shortcode, attempt);

      const collision = await urlRepository.exists(candidate);

      if (!collision) {
        urlRepository.save(shortcode, longUrl);

        return `${BASE_URL}/${candidate}`;
      }

      console.warn(
        `[url-service] - collision detected with candidate "${candidate}" (attempt ${attempt})`,
      );

      if (attempt === MAX_COLLISION_ATTEMPTS) {
        throw new Error(
          "Error while generating a new unique shortcode. Max attempts reached.",
        );
      }
    }

    throw new Error("Unexpected error.");
  },

  async resolve(shortcode: string): Promise<string | null> {
    return urlRepository.findByShortcode(shortcode);
  },
};
