'use client'
import { useEffect, useState } from 'react'
import { adminApi } from '../utils/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRegistration, setSelectedRegistration] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi('analytics/ioi')
        setStats(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className='text-black'>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Registrations</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {stats?.totals.registrations}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Paid Registrations</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats?.totals.paid}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Payment Percentage</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats?.totals.paymentPercentage}%
          </p>
        </div>
      </div>
      
      {/* Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Schools Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Schools</h3>
          <ul className="space-y-2">
            {stats?.distributions.schools?.map((school, index) => (
              <li key={index} className="flex justify-between">
                <span className="text-gray-700">{school.school}</span>
                <span className="font-semibold">{school.count}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Cities Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Cities</h3>
          <ul className="space-y-2">
            {stats?.distributions.cities?.map((city, index) => (
              <li key={index} className="flex justify-between">
                <span className="text-gray-700">{city.city}</span>
                <span className="font-semibold">{city.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Recent Registrations */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Registrations</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">School</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.recentRegistrations?.map((reg) => (
                <tr key={reg.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{reg.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{reg.schoolName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{reg.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{reg.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reg.paymentStatus === 'success'
                         ? 'bg-green-100 text-green-800'
                         : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reg.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => setSelectedRegistration(reg)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Registration Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Registration Details</h3>
              <button 
                onClick={() => setSelectedRegistration(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Basic Information</h4>
                <DetailsRow label="ID" value={selectedRegistration.id} />
                <DetailsRow label="Name" value={selectedRegistration.name} />
                <DetailsRow label="Email" value={selectedRegistration.email} />
                <DetailsRow label="Contact" value={selectedRegistration.candidateContact} />
                <DetailsRow label="Adhaar" value={selectedRegistration.candidateAdhaar} />
                <DetailsRow label="School" value={selectedRegistration.schoolName} />
                <DetailsRow label="City" value={selectedRegistration.city} />
                <DetailsRow label="Grade" value={selectedRegistration.grade} />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Coding Profiles</h4>
                <DetailsRow label="Codeforces Username" value={selectedRegistration.codeforcesUsername || 'N/A'} />
                <DetailsRow label="Codeforces Rating" value={selectedRegistration.codeforcesRating || 'N/A'} />
                <DetailsRow label="Codechef Username" value={selectedRegistration.codechefUsername || 'N/A'} />
                <DetailsRow label="Codechef Rating" value={selectedRegistration.codechefRating || 'N/A'} />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Guardian Information</h4>
                <DetailsRow label="Guardian Name" value={selectedRegistration.guardianName} />
                <DetailsRow label="Guardian Contact" value={selectedRegistration.guardianContact} />
                <DetailsRow label="Guardian Email" value={selectedRegistration.guardianEmail} />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Additional Information</h4>
                <DetailsRow label="Previous Participation" value={selectedRegistration.participationHistory} />
                <DetailsRow label="CP Achievements" value={selectedRegistration.CPAchievements || 'N/A'} />
                <DetailsRow label="Chennai Participation" value={selectedRegistration.chennaiParticipation} />
                <DetailsRow label="Volunteer Interest" value={selectedRegistration.volunteerInterest} />
                <DetailsRow label="Camp Interest" value={selectedRegistration.campInterest} />
                <DetailsRow label="T-Shirt Size" value={selectedRegistration.TShirtSize} />
                <DetailsRow label="Allergies" value={selectedRegistration.allergies || 'None'} />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Registration Status</h4>
                <DetailsRow label="Payment Status" value={selectedRegistration.paymentStatus} />
                <DetailsRow label="Registered On" value={new Date(selectedRegistration.createdAt).toLocaleString()} />
                <DetailsRow label="Last Updated" value={new Date(selectedRegistration.updatedAt).toLocaleString()} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper component for displaying details
function DetailsRow({ label, value }) {
  return (
    <div className="py-1">
      <div className="flex">
        <span className="text-sm text-gray-500 w-1/3">{label}:</span>
        <span className="text-sm font-medium text-gray-900">{value}</span>
      </div>
    </div>
  )
}