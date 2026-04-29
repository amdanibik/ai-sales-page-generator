"use client";

import { useState } from "react";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SalesPageContent, SectionKey, ProductInput } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface SectionRegenerateProps {
  input: ProductInput;
  content: SalesPageContent;
  onUpdate: (updated: SalesPageContent) => void;
}

const SECTIONS: { key: SectionKey; label: string; description: string }[] = [
  { key: "headline", label: "Headline", description: "Main attention-grabbing headline" },
  { key: "subHeadline", label: "Sub-Headline", description: "Supporting sub-headline" },
  { key: "productDescription", label: "Description", description: "Product/service description" },
  { key: "benefits", label: "Benefits", description: "4 key benefits section" },
  { key: "features", label: "Features", description: "5 features breakdown" },
  { key: "socialProof", label: "Testimonials", description: "3 customer testimonials" },
  { key: "pricing", label: "Pricing", description: "Pricing section" },
  { key: "cta", label: "Call to Action", description: "CTA buttons & urgency" },
];

export function SectionRegenerate({ input, content, onUpdate }: SectionRegenerateProps) {
  const [loadingSection, setLoadingSection] = useState<SectionKey | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const regenerate = async (section: SectionKey) => {
    setLoadingSection(section);
    try {
      const res = await fetch("/api/generate/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, section, currentContent: content }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to regenerate");
      }

      const { content: updatedSection } = await res.json();
      onUpdate({ ...content, ...updatedSection });
      toast({
        title: `${SECTIONS.find((s) => s.key === section)?.label} regenerated`,
        description: "Content updated successfully",
      });
    } catch (err) {
      toast({
        title: "Regeneration failed",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoadingSection(null);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
      >
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            Section-by-Section Regeneration
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Regenerate individual sections without changing the whole page
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SECTIONS.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={loadingSection !== null}
                onClick={() => regenerate(key)}
                className="ml-3 text-indigo-600 hover:bg-indigo-100 flex-shrink-0"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    loadingSection === key ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
