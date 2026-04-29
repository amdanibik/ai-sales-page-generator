"use client";

import { SalesPageContent } from "@/types";

interface Props {
  content: SalesPageContent;
  template: string;
  productName: string;
}

export function SalesPagePreview({ content, template, productName }: Props) {
  if (template === "bold") return <BoldTemplate content={content} productName={productName} />;
  if (template === "classic") return <ClassicTemplate content={content} productName={productName} />;
  return <ModernTemplate content={content} productName={productName} />;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

// ─── Modern Template ─────────────────────────────────────────────────────────
function ModernTemplate({ content, productName }: { content: SalesPageContent; productName: string }) {
  return (
    <div className="font-sans bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            {content.headline}
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            {content.subHeadline}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="bg-white text-indigo-600 px-8 py-3.5 rounded-full font-bold text-lg hover:bg-indigo-50 transition shadow-lg">
              {content.cta.primary}
            </button>
            <button className="border-2 border-white text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-white/10 transition">
              {content.cta.secondary}
            </button>
          </div>
          {content.cta.urgency && (
            <p className="mt-5 text-indigo-200 text-sm font-medium">
              ⚡ {content.cta.urgency}
            </p>
          )}
        </div>
      </section>

      {/* Product Description */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          {content.productDescription.split("\n\n").map((para, i) => (
            <p key={i} className="text-lg text-gray-600 leading-relaxed mb-5">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Why Choose {productName}?
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Everything you need to succeed
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Everything You Need
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Packed with powerful features
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {content.features.map((feature, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition group"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 bg-indigo-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Join thousands of satisfied customers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {content.socialProof.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <StarRating rating={t.rating} />
                <p className="text-gray-600 italic my-4 text-sm leading-relaxed">
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-500 mb-10">{content.pricing.description}</p>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
            <div className="text-6xl font-black mb-1">{content.pricing.price}</div>
            <div className="text-indigo-200 mb-6">{content.pricing.period}</div>
            <ul className="text-left space-y-3 mb-8">
              {content.pricing.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-green-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-white text-indigo-600 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition">
              {content.cta.primary}
            </button>
            {content.pricing.guarantee && (
              <p className="mt-4 text-indigo-200 text-xs">
                🔒 {content.pricing.guarantee}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Ready to Get Started?</h2>
          {content.cta.urgency && (
            <p className="text-indigo-200 mb-6">{content.cta.urgency}</p>
          )}
          <button className="bg-white text-indigo-600 px-12 py-4 rounded-full font-bold text-xl hover:bg-indigo-50 transition shadow-lg">
            {content.cta.primary}
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Bold Template ────────────────────────────────────────────────────────────
function BoldTemplate({ content, productName }: { content: SalesPageContent; productName: string }) {
  return (
    <div className="font-sans bg-slate-900 text-slate-100">
      {/* Hero */}
      <section className="relative py-24 px-6 border-b-2 border-amber-400">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block bg-amber-400 text-slate-900 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            🔥 Limited Time Offer
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-amber-400 mb-6 leading-tight">
            {content.headline}
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            {content.subHeadline}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="bg-amber-400 text-slate-900 px-10 py-4 rounded-lg font-black text-lg hover:bg-amber-300 transition shadow-lg shadow-amber-900/30">
              {content.cta.primary}
            </button>
            <button className="border-2 border-amber-400 text-amber-400 px-10 py-4 rounded-lg font-bold text-lg hover:bg-amber-400/10 transition">
              {content.cta.secondary}
            </button>
          </div>
          {content.cta.urgency && (
            <p className="mt-5 text-amber-300 text-sm font-semibold">
              ⚡ {content.cta.urgency}
            </p>
          )}
        </div>
      </section>

      {/* Product Description */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {content.productDescription.split("\n\n").map((para, i) => (
            <p key={i} className="text-lg text-slate-300 leading-relaxed mb-5">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-2">
            WHY {productName.toUpperCase()} WINS
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {content.benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-amber-400 transition"
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-2">
            WHAT YOU GET
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.features.map((feature, i) => (
              <div
                key={i}
                className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-amber-400/50 transition"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-2">
            REAL RESULTS
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {content.socialProof.map((t, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-700 rounded-xl p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-slate-300 italic mb-4 text-sm leading-relaxed">
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-2">LOCK IN YOUR PRICE</h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mb-8" />
          <p className="text-slate-400 mb-10">{content.pricing.description}</p>
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-8 text-slate-900 shadow-2xl shadow-amber-900/40">
            <div className="text-6xl font-black mb-1">{content.pricing.price}</div>
            <div className="text-slate-700 mb-6 font-medium">{content.pricing.period}</div>
            <ul className="text-left space-y-3 mb-8">
              {content.pricing.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-semibold">
                  <span className="font-black mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-slate-900 text-amber-400 py-4 rounded-xl font-black text-lg hover:bg-slate-800 transition">
              {content.cta.primary}
            </button>
            {content.pricing.guarantee && (
              <p className="mt-4 text-slate-700 text-xs font-medium">
                🔒 {content.pricing.guarantee}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-amber-400 text-slate-900 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-3">DON&apos;T WAIT — ACT NOW</h2>
          {content.cta.urgency && (
            <p className="text-slate-700 mb-6 font-semibold">{content.cta.urgency}</p>
          )}
          <button className="bg-slate-900 text-amber-400 px-12 py-4 rounded-lg font-black text-xl hover:bg-slate-800 transition shadow-xl">
            {content.cta.primary}
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Classic Template ─────────────────────────────────────────────────────────
function ClassicTemplate({ content, productName }: { content: SalesPageContent; productName: string }) {
  return (
    <div className="font-serif bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-b from-red-700 to-red-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-200 text-sm font-sans font-semibold uppercase tracking-widest mb-4">
            Introducing
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            {content.headline}
          </h1>
          <div className="w-24 h-0.5 bg-red-300 mx-auto mb-5" />
          <p className="text-xl text-red-100 font-sans mb-8 max-w-2xl mx-auto">
            {content.subHeadline}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="bg-white text-red-700 px-10 py-3.5 font-bold text-lg hover:bg-red-50 transition border-2 border-white font-sans">
              {content.cta.primary}
            </button>
            <button className="border-2 border-white text-white px-10 py-3.5 font-bold text-lg hover:bg-red-600 transition font-sans">
              {content.cta.secondary}
            </button>
          </div>
          {content.cta.urgency && (
            <p className="mt-5 text-red-200 text-sm font-sans">
              ⚡ {content.cta.urgency}
            </p>
          )}
        </div>
      </section>

      {/* Product Description */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-red-700 font-sans">
              — About {productName} —
            </h2>
          </div>
          {content.productDescription.split("\n\n").map((para, i) => (
            <p key={i} className="text-lg text-gray-700 leading-loose mb-5">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 font-sans mb-2">
            The Benefits You&apos;ll Experience
          </h2>
          <div className="w-16 h-0.5 bg-red-600 mx-auto mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {content.benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 p-5 flex gap-4"
              >
                <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-sans mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-sans">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 font-sans mb-2">
            Key Features
          </h2>
          <div className="w-16 h-0.5 bg-red-600 mx-auto mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.features.map((feature, i) => (
              <div key={i} className="p-5 border border-gray-200 text-center">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="text-base font-bold text-gray-900 font-sans mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm font-sans">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-14 px-6 bg-blue-50 border-y border-blue-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 font-sans mb-2">
            Customer Testimonials
          </h2>
          <div className="w-16 h-0.5 bg-red-600 mx-auto mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {content.socialProof.map((t, i) => (
              <div key={i} className="bg-white p-5 border border-blue-100">
                <StarRating rating={t.rating} />
                <p className="text-gray-700 italic my-3 text-sm leading-relaxed font-sans">
                  "{t.quote}"
                </p>
                <div className="border-t border-gray-100 pt-3">
                  <p className="font-bold text-gray-900 text-sm font-sans">{t.name}</p>
                  <p className="text-gray-400 text-xs font-sans">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-14 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 font-sans mb-2">
            Investment
          </h2>
          <div className="w-16 h-0.5 bg-red-600 mx-auto mb-6" />
          <p className="text-gray-600 font-sans mb-8">{content.pricing.description}</p>
          <div className="border-2 border-red-600 p-8">
            <div className="text-6xl font-bold text-red-700 font-sans mb-1">
              {content.pricing.price}
            </div>
            <div className="text-gray-500 font-sans mb-6">{content.pricing.period}</div>
            <ul className="text-left space-y-2.5 mb-8 border-t border-gray-100 pt-6">
              {content.pricing.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-sans">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-red-700 text-white py-4 font-bold text-lg hover:bg-red-800 transition font-sans">
              {content.cta.primary}
            </button>
            {content.pricing.guarantee && (
              <p className="mt-4 text-gray-500 text-xs font-sans">
                🔒 {content.pricing.guarantee}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 px-6 bg-red-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3 font-sans">
            Take Action Today
          </h2>
          {content.cta.urgency && (
            <p className="text-red-200 font-sans mb-6">{content.cta.urgency}</p>
          )}
          <button className="bg-white text-red-700 px-12 py-4 font-bold text-xl hover:bg-red-50 transition font-sans">
            {content.cta.primary}
          </button>
        </div>
      </section>
    </div>
  );
}
