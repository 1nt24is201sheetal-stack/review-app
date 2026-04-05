import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

import Login from './pages/Login'
import Register from './pages/Register'
import ReviewForm from './components/ReviewForm'
import ReviewCard from './components/ReviewCard'

import './App.css'

function Home() {
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const name = localStorage.getItem('name')

  useEffect(() => {
    axios.get('https://review-app-backendd.onrender.com/api/reviews')
      .then((res) => setReviews(res.data))
  }, [])

  function handleAdd(newReview) {
    setReviews([newReview, ...reviews])
  }

  function handleDelete(id) {
    setReviews(reviews.filter((r) => r._id !== id))
  }

  function handleEdit(updatedReview) {
    setReviews(reviews.map((r) => r._id === updatedReview._id ? updatedReview : r))
  }

  function handleLogout() {
    localStorage.clear()
    window.location.href = '/login'
  }

  // filter + search together
  const filteredReviews = reviews.filter((r) => {
    const matchesFilter = filter === 'all' || r.type === filter
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // stats
  const totalReviews = reviews.length
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'
  const movieCount = reviews.filter((r) => r.type === 'movie').length
  const bookCount = reviews.filter((r) => r.type === 'book').length

  return (
    <div>
      <div className="navbar">
        <div className="navbar-left">
          <span className="logo">🎬 ReviewApp</span>
        </div>
        <div className="nav-right">
          <span className="welcome-text">Hi, {name}!</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="hero">
        <h2>What have you been watching or reading?</h2>
        <p>Share your thoughts with the world</p>
      </div>

      <div className="container">

        {/* stats bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <span className="stat-number">{totalReviews}</span>
            <span className="stat-label">Total Reviews</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">⭐ {avgRating}</span>
            <span className="stat-label">Avg Rating</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">🎬 {movieCount}</span>
            <span className="stat-label">Movies</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">📚 {bookCount}</span>
            <span className="stat-label">Books</span>
          </div>
        </div>

        <ReviewForm onAdd={handleAdd} />

        {/* search bar */}
        <input
          className="search-bar"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* filter buttons */}
        <div className="filter-bar">
          <button
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'movie' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('movie')}
          >
            Movies
          </button>
          <button
            className={filter === 'book' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('book')}
          >
            Books
          </button>
        </div>

        <div className="reviews-list">
          {filteredReviews.length === 0 && (
            <div className="empty-state">
              <p>No reviews found. Try a different search!</p>
            </div>
          )}
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  // eslint-disable-next-line
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App