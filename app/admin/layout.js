import AdminLayout from '../components/AdminLayout'
import ProtectedRoute from '../components/ProtectedRoute'

export default function AdminDashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}