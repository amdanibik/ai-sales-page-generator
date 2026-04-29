import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updatePageSchema = z.object({
  productName: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  features: z.array(z.string()).min(1).optional(),
  targetAudience: z.string().min(1).optional(),
  price: z.string().min(1).optional(),
  usp: z.string().min(1).optional(),
  template: z.string().optional(),
  content: z.record(z.unknown()).optional(),
});

// GET /api/pages/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  return NextResponse.json({
    ...page,
    features: JSON.parse(page.features),
    content: JSON.parse(page.content),
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  });
}

// PUT /api/pages/[id] — update page
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existing = await db.salesPage.findUnique({
      where: { id: params.id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updatePageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { features, content, ...rest } = parsed.data;

    const updated = await db.salesPage.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(features && { features: JSON.stringify(features) }),
        ...(content && { content: JSON.stringify(content) }),
      },
    });

    return NextResponse.json({
      id: updated.id,
      message: "Page updated successfully",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/pages/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.salesPage.findUnique({
      where: { id: params.id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.salesPage.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Page deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
