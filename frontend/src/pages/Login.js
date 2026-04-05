import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email, password
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('name', res.data.name)
      navigate('/')

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Server is starting up, please try again in a few seconds!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Welcome back!</h2>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : 'Log In'}
        </button>
      </form>

      {loading && (
        <p style={{ marginTop: '10px', color: '#667eea', fontSize: '13px' }}>
          Server is waking up, this may take up to 30 seconds...
        </p>
      )}

      <p>New here? <a href="/register">Create an account</a></p>
    </div>
  )
}

export default Login