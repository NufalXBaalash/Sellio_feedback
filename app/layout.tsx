import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' })

export const metadata: Metadata = {
  title: 'SellioAI - Your Opinion Matters',
  description: 'Test the SellioAI sales agent and get 100% free access for sharing your feedback',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cairo.variable} font-sans bg-[#f8fdf9] text-gray-800`}>
        {children}
      </body>
    </html>
  )
}
