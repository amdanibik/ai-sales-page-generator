import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SalesGen AI — AI-Powered Sales Page Generator",
  description:
    "Transform your product information into stunning, high-converting sales pages using AI. Generate professional landing pages in seconds.",
  openGraph: {
    title: "SalesGen AI — AI-Powered Sales Page Generator",
    description: "Generate professional sales pages in seconds with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
