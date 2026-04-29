import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateSalesPage } from "@/lib/ai";
import { z } from "zod";

const generateSchema = z.object({
  productName: z.string().min(1).max(200),
  description: z.string().min(10).max(5000),
  features: z.array(z.string()).min(1).max(20),
  targetAudience: z.string().min(1).max(500),
  price: z.string().min(1).max(200),
  usp: z.string().min(1).max(2000),
  template: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { openaiApiKey: true },
    });

    if (!user?.openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not set. Please add your API key first." },
        { status: 422 }
      );
    }

    const content = await generateSalesPage(parsed.data, user.openaiApiKey);

    return NextResponse.json({ content });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate sales page. Please try again." },
      { status: 500 }
    );
  }
}
