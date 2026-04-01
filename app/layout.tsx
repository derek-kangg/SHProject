import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/layout/Nav";

export const metadata: Metadata = {
  title: "FORME — Your Personal AI Stylist",
  description: "Dress with confidence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F9F7F4] text-[#111110]">
        <Nav />
        <main className="max-w-[1100px] mx-auto px-8 py-8">{children}</main>
      </body>
    </html>
  );
}
