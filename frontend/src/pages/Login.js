import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const res = await axios.post('https://review-app-backendd.onrender.com/api/auth/login', {
        email, password
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('name', res.data.name)

      navigate('/')

    } catch (err) {
      setError(err.response.data.message)
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
        <button type="submit">Log In</button>
      </form>

      <p>New here? <a href="/register">Create an account</a></p>
    </div>
  )
}

export default Login