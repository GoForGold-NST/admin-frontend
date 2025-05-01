import { useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900">GFG Registration Admin Panel</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Welcome, {session?.user?.email}
          </span>
        </div>
      </div>
    </header>
  )
}