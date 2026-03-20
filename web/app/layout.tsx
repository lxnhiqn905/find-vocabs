import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Find Vocabs",
  description: "Look up English vocabulary definitions instantly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0e1a] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
