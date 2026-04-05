import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const res = await axios.post('https://review-app-backendd.onrender.com/api/auth/register', {
        name, email, password
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
      <h2>Create an account</h2>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Register</button>
      </form>

      <p>Already have an account? <a href="/login">Log in here</a></p>
    </div>
  )
}

export default Register