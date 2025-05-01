'use client'
import { useState } from 'react'
import { adminApi } from '@/app/utils/api'
import { BACKEND_URL } from '@/app/utils/url'

export default function ConfirmPaymentsPage() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('csvFile', file)

      const response = await fetch(`${BACKEND_URL}/admin/confirm-payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process payments')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Confirm Payments</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload CSV File
            </label>
            <div className="mt-1">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <p className="mt-2 text-sm text-black">
              CSV should contain a column with email addresses of participants to confirm payments for.
            </p>
          </div>
          
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Processing...' : 'Confirm Payments'}
            </button>
          </div>
        </form>
      </div>
      
      {result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Results</h3>
          <div className="space-y-2">
            <p className='text-black'><span className="font-medium">Total processed:</span> {result.processed}</p>
            <p className='text-black'><span className="font-medium">Failed:</span> {result.failed}</p>
            <p className='text-black'><span className="font-medium">Skipped:</span> {result.skipped}</p>
          </div>
          
          {result.payments && result.payments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-2">Payment Details</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.payments.map((payment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{payment.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{payment.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}