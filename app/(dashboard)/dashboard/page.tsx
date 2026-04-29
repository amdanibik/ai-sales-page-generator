import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { SalesPageCard } from "@/components/sales-page-card";
import { SalesPage, SalesPageContent } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, FileText, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const rawPages = await db.salesPage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      productName: true,
      description: true,
      features: true,
      targetAudience: true,
      price: true,
      usp: true,
      content: true,
      template: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    },
  });

  const pages: SalesPage[] = rawPages.map((p) => ({
    ...p,
    features: JSON.parse(p.features) as string[],
    content: JSON.parse(p.content) as SalesPageContent,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and create your AI-powered sales pages
          </p>
        </div>
        <Link href="/pages/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            New Sales Page
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
            <p className="text-sm text-gray-500">Total Pages</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {pages.filter((p) => p.template === "modern").length}
            </p>
            <p className="text-sm text-gray-500">Modern Templates</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {pages.length > 0
                ? new Date(pages[0].createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </p>
            <p className="text-sm text-gray-500">Last Generated</p>
          </div>
        </div>
      </div>

      {/* Pages Grid */}
      {pages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No sales pages yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Create your first AI-generated sales page in under 30 seconds.
          </p>
          <Link href="/pages/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Generate Your First Page
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Sales Pages
          </h2>
          <DashboardClient pages={pages} />
        </div>
      )}
    </div>
  );
}

// Client wrapper for delete functionality
import DashboardClient from "./dashboard-client";
