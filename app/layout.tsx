import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FORME — Your Personal AI Stylist',
  description: 'Dress with confidence. AI-powered outfit suggestions built around your wardrobe.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${cormorant.variable}`}>
        <Nav />
        <main className="max-w-[1100px] mx-auto px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
