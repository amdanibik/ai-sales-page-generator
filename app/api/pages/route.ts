import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createPageSchema = z.object({
  productName: z.string().min(1).max(200),
  description: z.string().min(1),
  features: z.array(z.string()).min(1),
  targetAudience: z.string().min(1),
  price: z.string().min(1),
  usp: z.string().min(1),
  template: z.string().optional().default("modern"),
  content: z.record(z.unknown()),
});

// GET /api/pages — list all pages for current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pages = await db.salesPage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    pages: pages.map((p) => ({
      ...p,
      features: JSON.parse(p.features),
      content: JSON.parse(p.content),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
  });
}

// POST /api/pages — create a new page
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createPageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { productName, description, features, targetAudience, price, usp, template, content } =
      parsed.data;

    const page = await db.salesPage.create({
      data: {
        userId: session.user.id,
        productName,
        description,
        features: JSON.stringify(features),
        targetAudience,
        price,
        usp,
        template,
        content: JSON.stringify(content),
      },
    });

    return NextResponse.json({
      id: page.id,
      message: "Page created successfully",
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
