import { NextResponse } from "next/server";
import { getAdminClient, markUnsubscribed } from "@/lib/waitlist/db";
import { SUPPORT_EMAIL, verifyUnsubscribe } from "@/lib/waitlist/unsubscribe";

// POST: used by the unsubscribe page and by Gmail/Outlook's built-in one-click "Unsubscribe" (RFC 8058).
export async function POST(request: Request) {
  const url = new URL(request.url);
  let e = url.searchParams.get("e");
  let t = url.searchParams.get("t");
  if (!e || !t) {
    try {
      const body = (await request.json()) as { e?: string; t?: string };
      e = e || body.e || null;
      t = t || body.t || null;
    } catch {
      // one-click clients send a form body instead of JSON; the link itself already carried e and t
    }
  }

  const email = verifyUnsubscribe(e, t);
  if (!email) {
    return NextResponse.json({ success: false, error: "This unsubscribe link is not valid." }, { status: 400 });
  }

  try {
    const result = await markUnsubscribed(getAdminClient(), email);
    if (!result.ok) {
      console.error("Unsubscribe failed:", result.error);
      return NextResponse.json(
        { success: false, error: `We could not update your preference. Please email ${SUPPORT_EMAIL} and we will remove you.` },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unsubscribe handler failed:", error);
    return NextResponse.json(
      { success: false, error: `We could not update your preference. Please email ${SUPPORT_EMAIL} and we will remove you.` },
      { status: 500 }
    );
  }
}

// GET: if a mail client or someone opens the API link directly, send them to the confirmation page instead.
export async function GET(request: Request) {
  const url = new URL(request.url);
  return NextResponse.redirect(new URL(`/unsubscribe${url.search}`, url.origin), 307);
}
