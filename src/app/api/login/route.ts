import { NextResponse } from "next/server";
import { findRegistrant } from "@/lib/registry";
import { normalizePhone } from "@/lib/phone";
import { ADMIN_PHONE } from "@/lib/config";
import { upsertAttendee } from "@/lib/api";

// POST { phone } → matches against the registration sheet.
// Returns the registrant profile (+ isAdmin) or 403 if not registered.
export async function POST(req: Request) {
  let phone = "";
  try {
    const body = await req.json();
    phone = String(body.phone || "");
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const normalized = normalizePhone(phone);
  if (!normalized) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  const isAdmin = normalizePhone(ADMIN_PHONE) === normalized;

  const registrant = await findRegistrant(phone);

  // Admin always allowed, even if not in the sheet.
  if (!registrant && !isAdmin) {
    return NextResponse.json(
      {
        error:
          "This number isn't registered. Please register first, then come back to log in.",
      },
      { status: 403 }
    );
  }

  const profile = registrant ?? {
    name: "Host",
    email: "",
    university: "",
    gender: "",
  };

  // Mirror into Supabase (if configured) to get a stable attendee id + score.
  const attendee = await upsertAttendee({
    phone: normalized,
    name: profile.name,
    email: profile.email,
    university: profile.university,
    gender: profile.gender,
  });

  return NextResponse.json({
    attendeeId: attendee?.id ?? null,
    phone: normalized,
    name: profile.name,
    email: profile.email,
    university: profile.university,
    gender: profile.gender,
    score: attendee?.score ?? 0,
    isAdmin,
  });
}
