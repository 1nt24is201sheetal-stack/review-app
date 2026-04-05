import { useState } from 'react'
import axios from 'axios'

// some popular suggestions
const suggestions = [
  'Inception', 'The Dark Knight', 'Interstellar', 'Parasite',
  'The Godfather', 'Oppenheimer', 'Dune', 'Avatar',
  'Harry Potter', 'The Alchemist', 'Atomic Habits', 'Rich Dad Poor Dad',
  'To Kill a Mockingbird', '1984', 'The Great Gatsby', 'Sapiens'
]

function ReviewForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('movie')
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // filter suggestions based on what user typed
  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(title.toLowerCase()) && title.length > 0
  )

  async function handleSubmit(e) {
    e.preventDefault()

    if (rating === 0) {
      alert('Please select a star rating!')
      return
    }

    const token = localStorage.getItem('token')

    const res = await axios.post(
      'https://review-app-backendd.onrender.com/api/reviews',
      { title, type, rating, reviewText },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    onAdd(res.data)

    setTitle('')
    setType('movie')
    setRating(0)
    setReviewText('')
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>

      {/* title input with suggestions */}
      <div className="input-wrapper">
        <input
          placeholder="Book or movie title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setShowSuggestions(true)
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          required
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="suggestions-box">
            {filteredSuggestions.map((s) => (
              <div
                key={s}
                className="suggestion-item"
                onMouseDown={() => {
                  setTitle(s)
                  setShowSuggestions(false)
                }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="movie">Movie</option>
        <option value="book">Book</option>
      </select>

      {/* star rating picker */}
      <label>Your Rating</label>
      <div className="star-picker">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= (hoveredStar || rating) ? 'star filled' : 'star'}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
        <span className="rating-label">
          {rating > 0 ? `${rating} / 5` : 'Click to rate'}
        </span>
      </div>

      <textarea
        placeholder="Write your review here..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        required
      />

      <button type="submit">Post Review</button>
    </form>
  )
}

export default ReviewForm