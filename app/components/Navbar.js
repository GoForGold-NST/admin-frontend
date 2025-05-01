export default function Navbar() {
    return (
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }