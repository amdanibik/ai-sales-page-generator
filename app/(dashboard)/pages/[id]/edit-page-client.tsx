"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Save,
  Sparkles,
  Loader2,
  Trash2,
  Download,
  ExternalLink,
} from "lucide-react";
import { ProductForm } from "@/components/product-form";
import { SalesPagePreview } from "@/components/sales-page-preview";
import { SectionRegenerate } from "@/components/section-regenerate";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductInput, SalesPageContent } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface Props {
  pageId: string;
  initialInput: ProductInput;
  initialContent: SalesPageContent;
}

export default function EditPageClient({ pageId, initialInput, initialContent }: Props) {
  const router = useRouter();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [content, setContent] = useState<SalesPageContent>(initialContent);
  const [productInput, setProductInput] = useState<ProductInput>(initialInput);
  const [activeTab, setActiveTab] = useState("preview");

  const handleRegenerate = async (input: ProductInput) => {
    setIsRegenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) throw new Error((await res.json()).error);
      const data = await res.json();
      setContent(data.content);
      setProductInput(input);
      setActiveTab("preview");
      toast({ title: "Page regenerated!" });
    } catch (err) {
      toast({
        title: "Regeneration failed",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productInput, content }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Changes saved!" });
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${productInput.productName}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Page deleted" });
      router.push("/dashboard");
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/pages/${pageId}/export`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${productInput.productName.replace(/\s+/g, "-").toLowerCase()}-sales-page.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {productInput.productName}
            </h1>
            <p className="text-sm text-gray-500 capitalize">
              {productInput.template} template
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/pages/${pageId}/preview`} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Full Preview
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 mr-1.5" />
            )}
            Export HTML
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1.5" />
            )}
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:bg-red-50"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="preview">
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview & Edit
          </TabsTrigger>
          <TabsTrigger value="regenerate">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Regenerate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="space-y-5">
            {/* Section Regeneration */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <SectionRegenerate
                input={productInput}
                content={content}
                onUpdate={setContent}
              />
            </div>

            {/* Preview Window */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white border border-gray-200 rounded px-3 py-1 text-xs text-gray-400 max-w-xs mx-auto text-center">
                  {productInput.productName} — Live Preview
                </div>
              </div>
              <div className="max-h-[700px] overflow-y-auto">
                <SalesPagePreview
                  content={content}
                  template={productInput.template ?? "modern"}
                  productName={productInput.productName}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="regenerate">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Regenerate Full Page
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update your product information and regenerate the entire sales page with fresh AI content.
              </p>
            </div>
            <ProductForm
              defaultValues={productInput}
              onSubmit={handleRegenerate}
              isLoading={isRegenerating}
              submitLabel="Regenerate Sales Page"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
