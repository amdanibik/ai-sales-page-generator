import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SalesPageContent } from "@/types";
import { SalesPagePreview } from "@/components/sales-page-preview";
import Link from "next/link";
import { ArrowLeft, Pencil, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  params: { id: string };
}

export default async function PreviewPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const page = await db.salesPage.findUnique({
    where: { id: params.id, userId: session.user.id },
  });

  if (!page) notFound();

  const content = JSON.parse(page.content) as SalesPageContent;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Preview Toolbar */}
      <div className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/pages/${params.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Editor
            </Button>
          </Link>
          <div className="hidden sm:flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-300 text-sm hidden sm:block">
            {page.productName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/api/pages/${params.id}/export`}
            download={`${page.productName.replace(/\s+/g, "-").toLowerCase()}-sales-page.html`}
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export HTML
            </Button>
          </a>
          <Link href={`/pages/${params.id}`}>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Full Page Preview */}
      <div className="bg-white">
        <SalesPagePreview
          content={content}
          template={page.template}
          productName={page.productName}
        />
      </div>
    </div>
  );
}
