import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Sparkles,
  Zap,
  Layout,
  Download,
  RefreshCw,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      desc: "GPT-4o writes compelling headlines, benefits, features, and CTAs tailored to your audience.",
    },
    {
      icon: Layout,
      title: "3 Professional Templates",
      desc: "Choose from Modern, Bold, or Classic designs. Each renders as a real landing page.",
    },
    {
      icon: RefreshCw,
      title: "Section Regeneration",
      desc: "Not happy with one section? Regenerate just the headline, pricing, or CTA without changing the rest.",
    },
    {
      icon: Download,
      title: "Export to HTML",
      desc: "Download your sales page as a standalone HTML file ready to deploy anywhere.",
    },
    {
      icon: Zap,
      title: "Instant Preview",
      desc: "See your sales page rendered in real-time before saving. Looks exactly like the live page.",
    },
    {
      icon: CheckCircle,
      title: "Save & Manage",
      desc: "All your pages are saved. View, edit, regenerate, or delete them from your dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">SalesGen AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/60 via-white to-white pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by GPT-4o
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Turn your product info into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              a stunning sales page
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Fill in your product details and our AI generates a complete, professional
            sales page with headlines, benefits, features, testimonials, and CTAs —
            in under 30 seconds.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register">
              <Button
                size="xl"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 font-bold"
              >
                Start Generating Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="xl" variant="outline" className="font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required · Free to get started
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Three steps to your perfect sales page
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Enter Product Details",
                desc: "Fill in your product name, description, key features, target audience, and pricing.",
                color: "bg-indigo-600",
              },
              {
                step: "2",
                title: "AI Generates Content",
                desc: "Our AI writes all sections: headline, benefits, features, testimonials, and CTAs.",
                color: "bg-purple-600",
              },
              {
                step: "3",
                title: "Preview & Export",
                desc: "Preview your page, fine-tune sections, save it, or export as a standalone HTML file.",
                color: "bg-blue-600",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className={`w-12 h-12 ${item.color} text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4`}
                >
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Everything You Need
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Professional sales page generation, from start to finish
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition"
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                  <feat.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Ready to generate your sales page?
          </h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Join thousands of marketers and entrepreneurs already using SalesGen AI
          </p>
          <Link href="/register">
            <Button
              size="xl"
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold shadow-xl"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} SalesGen AI · Built with Next.js, Prisma &
          OpenAI
        </p>
      </footer>
    </div>
  );
}
