import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SalesPageContent } from "@/types";
import { generateHtmlExport } from "@/lib/export";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = await db.salesPage.findUnique({
      where: { id: params.id, userId: session.user.id },
    });

    if (!page) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const content = JSON.parse(page.content) as SalesPageContent;
    const html = generateHtmlExport(page.productName, content, page.template);

    const filename = `${page.productName.replace(/\s+/g, "-").toLowerCase()}-sales-page.html`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
