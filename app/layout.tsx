import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WatchAdvisor — AI-Powered Garmin Watch Finder',
  description:
    'Tell us how you live. We find your perfect Garmin watch. AI-powered recommendations in seconds.',
  keywords: ['Garmin', 'watch recommendation', 'fitness watch', 'smartwatch', 'GPS watch'],
  openGraph: {
    title: 'WatchAdvisor — Find Your Perfect Garmin',
    description: 'AI-powered Garmin watch recommendations tailored to your lifestyle.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
