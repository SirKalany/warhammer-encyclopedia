import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "WHEncyclopedia",
  description: "Total War: Warhammer III Encyclopedia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg-base text-text-primary font-body min-h-screen">
        <Navbar />
        <main className="max-w-[1400px] mx-auto px-8 py-8">{children}</main>
      </body>
    </html>
  );
}
