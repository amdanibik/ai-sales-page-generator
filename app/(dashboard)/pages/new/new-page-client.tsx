"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Save, Sparkles, Loader2, KeyRound } from "lucide-react";
import { ProductForm } from "@/components/product-form";
import { SalesPagePreview } from "@/components/sales-page-preview";
import { SectionRegenerate } from "@/components/section-regenerate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductInput, SalesPageContent } from "@/types";
import { toast } from "@/components/ui/use-toast";

export default function NewPageClient() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<SalesPageContent | null>(null);
  const [productInput, setProductInput] = useState<ProductInput | null>(null);
  const [activeTab, setActiveTab] = useState("form");

  // API key state
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);

  useEffect(() => {
    fetch("/api/settings/openai-key")
      .then((r) => r.json())
      .then((d) => setHasApiKey(d.hasKey ?? false))
      .catch(() => setHasApiKey(false));
  }, []);

  const handleSaveApiKey = async () => {
    setIsSavingKey(true);
    try {
      const res = await fetch("/api/settings/openai-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKeyInput }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save key");
      }
      setHasApiKey(true);
      setApiKeyInput("");
      toast({ title: "API key saved!", description: "You can now generate sales pages." });
    } catch (err) {
      toast({
        title: "Failed to save API key",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleGenerate = async (input: ProductInput) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Generation failed");
      }

      const data = await res.json();
      setGeneratedContent(data.content);
      setProductInput(input);
      setActiveTab("preview");
      toast({
        title: "Sales page generated!",
        description: "Review the preview and save when ready.",
      });
    } catch (err) {
      toast({
        title: "Generation failed",
        description:
          err instanceof Error ? err.message : "Please check your API key and try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent || !productInput) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productInput, content: generatedContent }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      toast({ title: "Page saved successfully!" });
      router.push(`/pages/${data.id}`);
    } catch {
      toast({ title: "Failed to save page", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* API Key Setup — shown when key is not yet saved */}
      {hasApiKey === false && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <KeyRound className="w-5 h-5 text-amber-600" />
            <h2 className="font-semibold text-amber-800 text-base">OpenAI API Key Required</h2>
          </div>
          <p className="text-sm text-amber-700 mb-4">
            To generate sales pages you need to provide your OpenAI API key. It will be stored
            securely in the database and is only used for your account.
            Get your key at{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              platform.openai.com/api-keys
            </a>.
          </p>
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-1">
              <Label htmlFor="apikey" className="text-amber-800">API Key</Label>
              <Input
                id="apikey"
                placeholder="sk-..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="font-mono text-sm bg-white"
              />
            </div>
            <Button
              onClick={handleSaveApiKey}
              disabled={isSavingKey || !apiKeyInput.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isSavingKey ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save Key"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {hasApiKey === null && (
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
          <Loader2 className="w-4 h-4 animate-spin" />
          Checking API key...
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">New Sales Page</h1>
            <p className="text-sm text-gray-500">
              Fill in your product details to generate an AI-powered sales page
            </p>
          </div>
        </div>
        {generatedContent && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Page
              </>
            )}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="form">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Product Details
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedContent}>
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {hasApiKey === false && (
              <p className="text-sm text-amber-600 mb-4 flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Please save your OpenAI API key above before generating.
              </p>
            )}
            <ProductForm onSubmit={handleGenerate} isLoading={isGenerating} disabled={!hasApiKey} />
          </div>
        </TabsContent>

        <TabsContent value="preview">
          {generatedContent && productInput && (
            <div className="space-y-6">
              {/* Section Regeneration */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <SectionRegenerate
                  input={productInput}
                  content={generatedContent}
                  onUpdate={setGeneratedContent}
                />
              </div>

              {/* Sales Page Preview */}
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
                    content={generatedContent}
                    template={productInput.template ?? "modern"}
                    productName={productInput.productName}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("form")}
                >
                  Edit Details
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 font-semibold"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Sales Page
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
