import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI BabySense – Smart Cry & Care Assistant for Parents',
  description: 'AI BabySense is your smart parenting assistant that helps you understand your baby’s cries, track feeding, sleep, and diapers, and get personalized parenting tips.',
  icons: {
    icon: [
      { url: '/logo/favicon.ico', type: 'image/x-icon' },
      { url: '/logo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/logo/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome', url: '/logo/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/logo/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  manifest: '/logo/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
