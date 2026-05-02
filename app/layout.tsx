import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { VersionProvider } from "@/lib/VersionContext";
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
      <body>
        <VersionProvider>
          <Navbar />
          <main
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "2rem",
              width: "100%",
            }}
          >
            {children}
          </main>
        </VersionProvider>
      </body>
    </html>
  );
}
