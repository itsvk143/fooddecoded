import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "FoodDecode — Food Ingredient Analysis, Barcode Scanner & Nutri-Score",
  description:
    "Analyze packaged food labels with instant scientific precision. Detect harmful additives, ultra-processed Nova 4 ingredients, palm oil, added sugars, and allergens powered by MongoDB Atlas & Vercel serverless.",
  keywords: [
    "food ingredients",
    "barcode scanner",
    "nutri-score",
    "nova group",
    "ultra-processed food",
    "palm oil free",
    "food additive hazards",
  ],
  authors: [{ name: "FoodDecode Science Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
