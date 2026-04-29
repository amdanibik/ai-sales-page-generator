import OpenAI from "openai";
import { ProductInput, SalesPageContent, SectionKey } from "@/types";

function createClient(apiKey: string) {
  return new OpenAI({ apiKey });
}

function buildFullPrompt(input: ProductInput): string {
  return `You are an expert copywriter and marketing specialist with 15+ years of experience creating high-converting sales pages.

Generate a complete, compelling sales page for the following product/service. Return ONLY valid JSON — no markdown, no explanations.

Product Information:
- Name: ${input.productName}
- Description: ${input.description}
- Key Features: ${input.features.join(", ")}
- Target Audience: ${input.targetAudience}
- Price: ${input.price}
- Unique Selling Points: ${input.usp}

Return this exact JSON structure:
{
  "headline": "A powerful, benefit-focused headline (max 10 words, no generic phrases)",
  "subHeadline": "A supporting sub-headline that elaborates with specifics (max 20 words)",
  "productDescription": "A compelling 2-3 paragraph description. Each paragraph separated by \\n\\n. Focus on transformation and value.",
  "benefits": [
    {"icon": "emoji", "title": "Short benefit title", "description": "2-3 sentence description of the benefit and value"}
  ],
  "features": [
    {"icon": "emoji", "title": "Feature name", "description": "Brief, clear feature description"}
  ],
  "socialProof": [
    {"name": "Full Name", "role": "Job Title", "company": "Company Name", "quote": "Specific, credible testimonial quote with measurable results", "rating": 5}
  ],
  "pricing": {
    "price": "${input.price}",
    "period": "one-time payment / per month / per year",
    "description": "Brief value statement for the price",
    "includes": ["List of what's included"],
    "guarantee": "Guarantee statement (e.g., 30-day money-back guarantee)"
  },
  "cta": {
    "primary": "Action-oriented primary button text",
    "secondary": "Secondary option text",
    "urgency": "Urgency or scarcity message (optional)"
  }
}

Requirements:
- Generate exactly 4 benefits, 5 features, and 3 testimonials
- Make content highly persuasive and tailored to the "${input.targetAudience}" audience
- Use specific, credible language — avoid vague marketing clichés
- Testimonials should feel authentic with specific results/numbers
- All emojis must be relevant to the context`;
}

function buildSectionPrompt(
  input: ProductInput,
  section: SectionKey,
  currentContent: SalesPageContent
): string {
  const sectionDescriptions: Record<SectionKey, string> = {
    headline: 'a new compelling headline (string, max 10 words)',
    subHeadline: 'a new supporting sub-headline (string, max 20 words)',
    productDescription: 'a new 2-3 paragraph product description (string, paragraphs separated by \\n\\n)',
    benefits: 'an array of 4 benefit objects: [{icon, title, description}]',
    features: 'an array of 5 feature objects: [{icon, title, description}]',
    socialProof: 'an array of 3 testimonial objects: [{name, role, company, quote, rating}]',
    pricing: 'a pricing object: {price, period, description, includes[], guarantee}',
    cta: 'a cta object: {primary, secondary, urgency}',
  };

  return `You are an expert copywriter. Regenerate ONLY the "${section}" section for this sales page.

Product: ${input.productName}
Description: ${input.description}
Target Audience: ${input.targetAudience}
Price: ${input.price}
USP: ${input.usp}

Current headline for context: "${currentContent.headline}"

Return ONLY valid JSON for ${sectionDescriptions[section]} — nothing else, no explanation.`;
}

export async function generateSalesPage(
  input: ProductInput,
  apiKey: string
): Promise<SalesPageContent> {
  const openai = createClient(apiKey);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert marketing copywriter. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: buildFullPrompt(input),
      },
    ],
    temperature: 0.8,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content returned from AI");

  return JSON.parse(content) as SalesPageContent;
}

export async function regenerateSection(
  input: ProductInput,
  section: SectionKey,
  currentContent: SalesPageContent,
  apiKey: string
): Promise<Partial<SalesPageContent>> {
  const openai = createClient(apiKey);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert marketing copywriter. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: buildSectionPrompt(input, section, currentContent),
      },
    ],
    temperature: 0.9,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content returned from AI");

  const parsed = JSON.parse(content);

  // Wrap scalar values in an object if section is headline/subHeadline/productDescription
  if (
    section === "headline" ||
    section === "subHeadline" ||
    section === "productDescription"
  ) {
    const value = parsed[section] ?? parsed.value ?? parsed.result ?? Object.values(parsed)[0];
    return { [section]: value } as Partial<SalesPageContent>;
  }

  return { [section]: parsed[section] ?? Object.values(parsed)[0] } as Partial<SalesPageContent>;
}
