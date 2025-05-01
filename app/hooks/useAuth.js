import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BACKEND_URL } from '../utils/url'

export function useAuth() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${BACKEND_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      localStorage.setItem('token', data.token)
      router.push('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${BACKEND_URL}/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      router.push('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return { login, register, logout, error, loading }
}