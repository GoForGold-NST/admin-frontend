import './globals.css'

export const metadata = {
  title: 'Gfg Registration System',
  description: 'Admin dashboard for Gfg registrations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}