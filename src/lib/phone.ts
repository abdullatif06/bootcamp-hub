// Smart phone normalization for Jordan numbers.
// Goal: 0795276144, 962795276144, +962 795 276144, "962 779333573"
// should all resolve to the same canonical key.
//
// Strategy: strip everything non-digit, drop a leading "962" country code,
// drop a leading "0", then keep the last 9 digits.

export function normalizePhone(input: string): string {
  let digits = (input || "").replace(/\D/g, "");
  if (!digits) return "";

  // Drop Jordan country code if present.
  if (digits.startsWith("962")) digits = digits.slice(3);
  // Drop a single leading zero (local trunk prefix).
  if (digits.startsWith("0")) digits = digits.slice(1);

  // Jordan mobile core is 9 digits (e.g. 79xxxxxxx). Keep the last 9.
  if (digits.length > 9) digits = digits.slice(-9);

  return digits;
}

/** True if two phone strings refer to the same number after normalization. */
export function phonesMatch(a: string, b: string): boolean {
  const na = normalizePhone(a);
  const nb = normalizePhone(b);
  return na.length > 0 && na === nb;
}
