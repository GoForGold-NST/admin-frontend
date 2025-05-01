import { BACKEND_URL } from "./url"

export async function adminApi(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token')
  
  const headers = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const options = {
    method,
    headers,
  }
  
  if (body) {
    options.body = JSON.stringify(body)
  }
  
  const response = await fetch(`${BACKEND_URL}/admin/${endpoint}`, options)
  
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  
  return await response.json()
}