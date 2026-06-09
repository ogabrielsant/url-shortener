const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE = BigInt(BASE62.length);
const SHORTCODE_LENGTH = 7; // 67^7 ~ 3.5t codes

export function toBase62(number: bigint) {
  if (number === 0n) {
    return BASE62[0].padStart(SHORTCODE_LENGTH, BASE62[0]);
  }

  let result = "";
  let i = number;

  while (i > 0n) {
    result = BASE62[Number(i % BASE)] + result;
    i = i / BASE;
  }

  return result.padStart(SHORTCODE_LENGTH, BASE62[0]);
}

export function salt(shortcode: string, attempt: number): string {
  const salt = String(attempt).padStart(2, "0");

  return shortcode.slice(0, SHORTCODE_LENGTH - salt.length) + salt;
}
