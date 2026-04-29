"use client";

import { useState } from "react";
import { Plus, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { TEMPLATES, ProductInput } from "@/types";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  defaultValues?: Partial<ProductInput>;
  onSubmit: (data: ProductInput) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
  submitLabel?: string;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isLoading,
  disabled = false,
  submitLabel = "Generate Sales Page",
}: ProductFormProps) {
  const [productName, setProductName] = useState(defaultValues?.productName ?? "");
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [features, setFeatures] = useState<string[]>(
    defaultValues?.features ?? [""]
  );
  const [targetAudience, setTargetAudience] = useState(
    defaultValues?.targetAudience ?? ""
  );
  const [price, setPrice] = useState(defaultValues?.price ?? "");
  const [usp, setUsp] = useState(defaultValues?.usp ?? "");
  const [template, setTemplate] = useState(defaultValues?.template ?? "modern");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addFeature = () => setFeatures((prev) => [...prev, ""]);
  const removeFeature = (index: number) =>
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  const updateFeature = (index: number, value: string) =>
    setFeatures((prev) => prev.map((f, i) => (i === index ? value : f)));

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!productName.trim()) newErrors.productName = "Product name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!targetAudience.trim()) newErrors.targetAudience = "Target audience is required";
    if (!price.trim()) newErrors.price = "Price is required";
    if (!usp.trim()) newErrors.usp = "Unique selling points are required";
    const validFeatures = features.filter((f) => f.trim());
    if (validFeatures.length === 0)
      newErrors.features = "At least one feature is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      productName: productName.trim(),
      description: description.trim(),
      features: features.filter((f) => f.trim()),
      targetAudience: targetAudience.trim(),
      price: price.trim(),
      usp: usp.trim(),
      template,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="productName">
          Product / Service Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="productName"
          placeholder="e.g. TaskFlow Pro, SEO Mastery Course"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className={errors.productName ? "border-red-400" : ""}
        />
        {errors.productName && (
          <p className="text-xs text-red-500">{errors.productName}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Product Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your product or service in detail. What problem does it solve? What transformation does it offer?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={cn("min-h-[120px]", errors.description ? "border-red-400" : "")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Features */}
      <div className="space-y-2">
        <Label>
          Key Features <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Feature ${index + 1}, e.g. Real-time collaboration`}
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className={errors.features && !feature.trim() ? "border-red-400" : ""}
              />
              {features.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(index)}
                  className="text-gray-400 hover:text-red-500 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {errors.features && (
          <p className="text-xs text-red-500">{errors.features}</p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addFeature}
          className="mt-1"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Feature
        </Button>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label htmlFor="targetAudience">
          Target Audience <span className="text-red-500">*</span>
        </Label>
        <Input
          id="targetAudience"
          placeholder="e.g. Small business owners, Freelance designers, Marketing managers"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          className={errors.targetAudience ? "border-red-400" : ""}
        />
        {errors.targetAudience && (
          <p className="text-xs text-red-500">{errors.targetAudience}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">
          Price <span className="text-red-500">*</span>
        </Label>
        <Input
          id="price"
          placeholder="e.g. $49/month, $299 one-time, Free with premium at $19/mo"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={errors.price ? "border-red-400" : ""}
        />
        {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
      </div>

      {/* USP */}
      <div className="space-y-2">
        <Label htmlFor="usp">
          Unique Selling Points <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="usp"
          placeholder="What makes your product different? e.g. Only tool that integrates with 500+ apps, Built by industry experts with 20+ years experience"
          value={usp}
          onChange={(e) => setUsp(e.target.value)}
          className={cn("min-h-[100px]", errors.usp ? "border-red-400" : "")}
        />
        {errors.usp && <p className="text-xs text-red-500">{errors.usp}</p>}
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <Label>Design Template</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEMPLATES.map((tmpl) => (
            <Card
              key={tmpl.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                template === tmpl.id
                  ? "ring-2 ring-indigo-500 shadow-md"
                  : "hover:border-indigo-300"
              )}
              onClick={() => setTemplate(tmpl.id)}
            >
              <CardContent className="p-4">
                <div
                  className={cn(
                    "h-12 rounded-md mb-3",
                    tmpl.preview
                  )}
                />
                <p className="font-semibold text-sm text-gray-900">{tmpl.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{tmpl.description}</p>
                {template === tmpl.id && (
                  <span className="mt-2 inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="xl"
        disabled={isLoading || disabled}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-indigo-200 hover:shadow-xl transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating your sales page...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            {submitLabel}
          </>
        )}
      </Button>

      {isLoading && (
        <p className="text-center text-sm text-gray-500 animate-pulse">
          AI is crafting your perfect sales page — this takes about 15-30 seconds
        </p>
      )}
    </form>
  );
}
