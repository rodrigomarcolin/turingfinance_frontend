import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TuringFinance',
  description: 'O site de Quant do turing.usp',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <Navbar></Navbar>
        </header>
        {children}
      </body>
    </html>
  )
}
