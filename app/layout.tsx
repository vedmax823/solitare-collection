import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spider Solitare',
  description: 'Created by Max Vedernikov',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className={cn("bg-gradient-to-b from-green-800 to-green-500 min-h-screen", inter.className)} >
      <Navbar />
        {children}
      </body>
    </html>
  )
}
