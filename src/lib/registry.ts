import { REGISTRATION_CSV_URL } from "./config";
import { SEED_REGISTRANTS, type Registrant } from "./attendees-seed";
import { normalizePhone } from "./phone";

// Parse a published-to-web Google Sheet CSV into Registrant rows.
// Expected columns: Name, Email, Phone, Confirmed, University, Gender.
// Tolerates a header row and quoted fields with commas.

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function looksLikeHeader(row: string[]): boolean {
  const joined = row.join(" ").toLowerCase();
  return joined.includes("name") || joined.includes("phone") || joined.includes("email");
}

// Find the best column whose header matches a keyword. Google Form sheets
// often have DUPLICATE headers (e.g. several "Email" columns) where only one
// holds data. We gather ALL columns matching ANY keyword, then pick the one
// with the most populated cells (ties broken by the keyword priority order,
// then by earliest column).
function findCol(headers: string[], keywords: string[], body: string[][]): number {
  const norm = headers.map((h) => h.trim().toLowerCase());
  const fillCount = (i: number) =>
    body.reduce((n, r) => n + ((r[i] || "").trim() !== "" ? 1 : 0), 0);

  type Cand = { idx: number; rank: number; fill: number };
  const cands: Cand[] = [];
  keywords.forEach((kw, rank) => {
    norm.forEach((h, idx) => {
      if (h.includes(kw) && !cands.some((c) => c.idx === idx)) {
        cands.push({ idx, rank, fill: fillCount(idx) });
      }
    });
  });
  if (cands.length === 0) return -1;

  cands.sort((a, b) => b.fill - a.fill || a.rank - b.rank || a.idx - b.idx);
  return cands[0].idx;
}

function rowsToRegistrants(rows: string[][]): Registrant[] {
  if (rows.length === 0) return [];

  const hasHeader = looksLikeHeader(rows[0]);
  const headers = hasHeader ? rows[0] : [];
  const body = hasHeader ? rows.slice(1) : rows;

  // Map columns by header name so the parser survives Google Form's extra
  // columns and any reordering. Falls back to fixed positions if no header.
  const col = hasHeader
    ? {
        name: findCol(headers, ["full name (english)", "full name", "name"], body),
        email: findCol(headers, ["email address", "email"], body),
        phone: findCol(headers, ["phone number", "phone"], body),
        confirmed: findCol(headers, ["confirmed", "university student", "payment"], body),
        university: findCol(headers, ["which university", "university"], body),
        gender: findCol(headers, ["gender"], body),
      }
    : { name: 0, email: 1, phone: 2, confirmed: 3, university: 4, gender: 5 };

  const at = (r: string[], i: number) => (i >= 0 ? (r[i] || "").trim() : "");

  return body.map((r) => ({
    name: at(r, col.name),
    email: at(r, col.email),
    phone: at(r, col.phone),
    confirmed: at(r, col.confirmed),
    university: at(r, col.university),
    gender: at(r, col.gender),
  }));
}

let _cache: { at: number; data: Registrant[] } | null = null;
const TTL_MS = 60_000; // re-fetch the sheet at most once a minute

export async function loadRegistrants(): Promise<Registrant[]> {
  if (!REGISTRATION_CSV_URL) return SEED_REGISTRANTS;

  if (_cache && Date.now() - _cache.at < TTL_MS) return _cache.data;

  try {
    const res = await fetch(REGISTRATION_CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
    const text = await res.text();
    const data = rowsToRegistrants(parseCsv(text)).filter((r) => r.phone);
    _cache = { at: Date.now(), data };
    return data.length ? data : SEED_REGISTRANTS;
  } catch (e) {
    console.warn("Falling back to seed registrants:", e);
    return SEED_REGISTRANTS;
  }
}

/** Find a registrant by phone (smart-normalized). Returns null if not registered. */
export async function findRegistrant(phone: string): Promise<Registrant | null> {
  const target = normalizePhone(phone);
  if (!target) return null;
  const list = await loadRegistrants();
  return list.find((r) => normalizePhone(r.phone) === target) || null;
}
