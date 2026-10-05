// Webhook Sanity → natychmiastowe odświeżenie statycznych stron po publikacji treści.
// Konfiguracja: sanity.io/manage → API → Webhooks
//   URL:     https://www.maxime.com.pl/api/revalidate
//   Trigger: Create, Update, Delete   |  HTTP method: POST  |  Secret: SANITY_REVALIDATE_SECRET
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SANITY_TAG } from "@/sanity/lib/fetch";

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "Brak SANITY_REVALIDATE_SECRET" },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Nieprawidłowy podpis" },
        { status: 401 },
      );
    }

    // Serwis jest mały i mocno powiązany (strona główna pokazuje wydarzenia, aktualności
    // i galerię), więc po każdej zmianie odświeżamy wszystkie strony zależne od CMS.
    revalidateTag(SANITY_TAG, { expire: 0 });

    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
  } catch (error) {
    console.error("Błąd webhooka revalidate:", error);
    return NextResponse.json({ message: "Błąd serwera" }, { status: 500 });
  }
}
