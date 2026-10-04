import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { CMS_TAG } from "@/lib/cms";

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.REVALIDATE_TOKEN;
  if (!expected) return false;
  const given =
    req.nextUrl.searchParams.get("token") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Webhook z panelu afto.works „po zmianie treści” → POST /api/revalidate?token=…
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag(CMS_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
