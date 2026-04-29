import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { regenerateSection } from "@/lib/ai";
import { z } from "zod";
import { SectionKey } from "@/types";

const VALID_SECTIONS: SectionKey[] = [
  "headline",
  "subHeadline",
  "productDescription",
  "benefits",
  "features",
  "socialProof",
  "pricing",
  "cta",
];

const sectionSchema = z.object({
  input: z.object({
    productName: z.string().min(1),
    description: z.string().min(1),
    features: z.array(z.string()),
    targetAudience: z.string().min(1),
    price: z.string().min(1),
    usp: z.string().min(1),
  }),
  section: z.string(),
  currentContent: z.record(z.unknown()),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = sectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { input, section, currentContent } = parsed.data;

    if (!VALID_SECTIONS.includes(section as SectionKey)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
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

    const updatedSection = await regenerateSection(
      input,
      section as SectionKey,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentContent as any,
      user.openaiApiKey
    );

    return NextResponse.json({ content: updatedSection });
  } catch (err) {
    console.error("Section regenerate error:", err);
    return NextResponse.json(
      { error: "Failed to regenerate section. Please try again." },
      { status: 500 }
    );
  }
}
