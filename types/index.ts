export interface ProductInput {
  productName: string;
  description: string;
  features: string[];
  targetAudience: string;
  price: string;
  usp: string;
  template?: string;
}

export interface SalesPageContent {
  headline: string;
  subHeadline: string;
  productDescription: string;
  benefits: Benefit[];
  features: Feature[];
  socialProof: Testimonial[];
  pricing: PricingInfo;
  cta: CallToAction;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

export interface PricingInfo {
  price: string;
  period: string;
  description: string;
  includes: string[];
  guarantee?: string;
}

export interface CallToAction {
  primary: string;
  secondary: string;
  urgency?: string;
}

export interface SalesPage {
  id: string;
  userId: string;
  productName: string;
  description: string;
  features: string[];
  targetAudience: string;
  price: string;
  usp: string;
  content: SalesPageContent;
  template: string;
  createdAt: string;
  updatedAt: string;
}

export type SectionKey =
  | "headline"
  | "subHeadline"
  | "productDescription"
  | "benefits"
  | "features"
  | "socialProof"
  | "pricing"
  | "cta";

export const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean gradients, cards, and modern typography",
    preview: "bg-gradient-to-br from-indigo-500 to-purple-600",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Dark background, high contrast, bold impact",
    preview: "bg-gray-900",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional marketing layout, professional feel",
    preview: "bg-white border-2 border-red-500",
  },
] as const;
