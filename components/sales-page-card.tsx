"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  MoreVertical,
  Download,
  Calendar,
  Loader2,
} from "lucide-react";
import { SalesPage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, truncate } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface SalesPageCardProps {
  page: SalesPage;
  onDelete: (id: string) => void;
}

const templateColors: Record<string, string> = {
  modern: "bg-indigo-100 text-indigo-700",
  bold: "bg-slate-800 text-amber-400",
  classic: "bg-red-100 text-red-700",
};

export function SalesPageCard({ page, onDelete }: SalesPageCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${page.productName}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/pages/${page.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onDelete(page.id);
      toast({ title: "Page deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setShowMenu(false);
    try {
      const res = await fetch(`/api/pages/${page.id}/export`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${page.productName.replace(/\s+/g, "-").toLowerCase()}-sales-page.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Exported successfully", variant: "success" as never });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all group overflow-hidden">
      {/* Color strip */}
      <div
        className={`h-1.5 ${
          page.template === "bold"
            ? "bg-amber-400"
            : page.template === "classic"
            ? "bg-red-600"
            : "bg-gradient-to-r from-indigo-500 to-purple-500"
        }`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base truncate">
              {page.productName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                className={`text-xs capitalize ${
                  templateColors[page.template] ?? templateColors.modern
                }`}
              >
                {page.template}
              </Badge>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(page.createdAt)}
              </span>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-400 hover:text-gray-700"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40 animate-fade-in">
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    {isExporting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    Export HTML
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          {truncate(page.description, 100)}
        </p>

        {/* Generated Headline */}
        {page.content.headline && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-400 mb-1 font-medium">Generated headline</p>
            <p className="text-sm font-semibold text-gray-800 leading-snug">
              {truncate(page.content.headline, 80)}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/pages/${page.id}/preview`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Preview
            </Button>
          </Link>
          <Link href={`/pages/${page.id}`} className="flex-1">
            <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
