import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}