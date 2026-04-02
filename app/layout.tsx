import "./globals.css";
import Nav from "@/components/layout/Nav";
import { ClosetProvider } from "@/lib/closet-context";
import { SavedLooksProvider } from "@/lib/saved-looks-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FORME — Your Personal AI Stylist",
  description: "Dress with confidence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F9F7F4] text-[#111110]">
        <ClosetProvider>
          <SavedLooksProvider>
            <Nav />
            <main className="max-w-[1100px] mx-auto px-8 py-8">{children}</main>
          </SavedLooksProvider>
        </ClosetProvider>
      </body>
    </html>
  );
}
