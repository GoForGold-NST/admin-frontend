'use client';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { FiHome, FiDollarSign, FiMail, FiUsers, FiCheckCircle, FiPieChart } from 'react-icons/fi'

const Sidebar = () => {
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Analytics', href: '/admin/analytics', icon: FiPieChart },
    { name: 'Confirm Payments', href: '/admin/confirm-payments', icon: FiDollarSign },
    { name: 'Send Reminders', href: '/admin/send-reminders', icon: FiMail },
    { name: 'Verify QR', href: '/admin/verify-qr', icon: FiCheckCircle },
  ]

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">GFG Admin</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  router.pathname === item.href
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    router.pathname === item.href
                      ? 'text-indigo-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4 cursor-pointer">
          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/login'
            }}
            className="flex-shrink-0 w-full group block"
          >
            <div className="flex items-center">
              <div className='cursor-pointer'>
                <svg
                  className="h-5 w-5 text-gray-500 group-hover:text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 cursor-pointer">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Sign out
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar