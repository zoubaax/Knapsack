import { useState, useEffect } from 'react'
import { apiService } from './services/api'
import Login from './components/Login'
import Register from './components/Register'
import DashboardLayout from './components/DashboardLayout'
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
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    } else if (savedUser && !savedToken) {
      // User data exists but no token - clear and require re-login
      console.warn('User session found but token missing. Please login again.')
      localStorage.removeItem('user')
      localStorage.removeItem('token')
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
    localStorage.removeItem('token')
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
  return <DashboardLayout user={user} onLogout={handleLogout} />
}

export default App
