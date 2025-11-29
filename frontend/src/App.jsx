import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import api from './api/api'

function App() {
  const [count, setCount] = useState(0)
  const [backendMessage, setBackendMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Test connection to Spring Boot backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get('/hello')
        setBackendMessage(data.message)
        setLoading(false)
      } catch (err) {
        setError('Failed to connect to backend: ' + err.message)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Hospital Management System</h1>
      
      {/* Backend Connection Status */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3>Backend Connection Status:</h3>
        {loading && <p>Connecting to backend...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {backendMessage && (
          <p style={{ color: 'green' }}>✅ {backendMessage}</p>
        )}
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
