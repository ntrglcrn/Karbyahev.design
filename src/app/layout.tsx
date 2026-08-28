import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const arizona = localFont({
  src: "../assets/fonts/ABCArizonaFlareTrial-Bold.otf",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-arizona",
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  title: "Karbyshev",
  description: "Karbyshev design",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={arizona.variable} lang="ru">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
