import { useState, useEffect } from 'react'

export default function useFetch(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        })
        
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        
        const json = await response.json()
        setData(json)
        setError(null)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [url])

  return { data, loading, error }
}