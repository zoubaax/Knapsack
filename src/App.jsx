import { useState, useEffect } from 'react'
import { apiService } from './services/api'
import Login from './components/Login'
import Register from './components/Register'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [healthStatus, setHealthStatus] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  // Example GET request - Health check
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await apiService.healthCheck()
        setHealthStatus(response.data)
      } catch (err) {
        setError('Failed to connect to backend')
        console.error('Health check error:', err)
      }
    }
    fetchHealth()
  }, [])

  // Example GET request - Fetch data
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getData()
      setData(response.data)
    } catch (err) {
      setError('Failed to fetch data from backend')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const handleLogin = (userData) => {
    setUser(userData)
    setShowRegister(false)
  }

  const handleRegister = (userData) => {
    setUser(userData)
    setShowRegister(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setData(null)
  }

  // Show login/register if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {showRegister ? (
            <Register 
              onRegister={handleRegister}
              switchToLogin={() => setShowRegister(false)}
            />
          ) : (
            <Login 
              onLogin={handleLogin}
              switchToRegister={() => setShowRegister(true)}
            />
          )}
        </div>
      </div>
    )
  }

  // Show dashboard if authenticated
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with user info and logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold underline">
            Welcome, {user.full_name}!
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>

        {/* User Info */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Full Name:</strong> {user.full_name}</p>
        </div>

        {/* Health Check Status */}
        {healthStatus && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Backend Status:</p>
            <p>{healthStatus.message}</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Data Display */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Example Data from Flask Backend</h2>
          
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : data ? (
            <div>
              <p className="mb-4">Total items: {data.total}</p>
              <ul className="space-y-2">
                {data.items.map((item) => (
                  <li key={item.id} className="border-b pb-2">
                    <span className="font-semibold">{item.name}</span> - Value: {item.value}
                  </li>
                ))}
              </ul>
              <button
                onClick={fetchData}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Refresh Data
              </button>
            </div>
          ) : (
            <p className="text-gray-600">No data available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
