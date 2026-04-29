import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// GET — check whether the current user has an OpenAI API key stored
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { openaiApiKey: true },
  });

  return NextResponse.json({ hasKey: !!user?.openaiApiKey });
}

// POST — save (or update) the OpenAI API key for the current user
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const apiKey: string = (body?.apiKey ?? "").trim();

  if (!apiKey.startsWith("sk-")) {
    return NextResponse.json(
      { error: "Invalid API key format. Key must start with 'sk-'." },
      { status: 400 }
    );
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { openaiApiKey: apiKey },
  });

  return NextResponse.json({ success: true });
}
