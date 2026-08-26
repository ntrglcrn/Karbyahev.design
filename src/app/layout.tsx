import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karbyshev",
  description: "Karbyshev design",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
