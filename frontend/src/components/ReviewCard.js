import { useState } from 'react'
import axios from 'axios'

function ReviewCard({ review, onDelete, onEdit }) {
  const currentUser = localStorage.getItem('name')
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(review.title)
  const [editType, setEditType] = useState(review.type)
  const [editRating, setEditRating] = useState(review.rating)
  const [editText, setEditText] = useState(review.reviewText)
  const [hoveredStar, setHoveredStar] = useState(0)

  async function handleDelete() {
    const token = localStorage.getItem('token')
    await axios.delete(`https://review-app-backendd.onrender.com/api/reviews/${review._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    onDelete(review._id)
  }

  async function handleEdit() {
    const token = localStorage.getItem('token')
    const res = await axios.put(
      `https://review-app-backendd.onrender.com/api/reviews/${review._id}`,
      { title: editTitle, type: editType, rating: editRating, reviewText: editText },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    onEdit(res.data)
    setIsEditing(false)
  }

  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)

  // show edit form if editing
  if (isEditing) {
    return (
      <div className="review-card editing">
        <h4 style={{ marginBottom: '10px', color: '#667eea' }}>Edit Review</h4>

        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          style={{ width: '100%', marginBottom: '8px', padding: '10px', borderRadius: '8px', border: '2px solid #e8ecff', fontSize: '14px' }}
        />

        <select
          value={editType}
          onChange={(e) => setEditType(e.target.value)}
          style={{ width: '100%', marginBottom: '8px', padding: '10px', borderRadius: '8px', border: '2px solid #e8ecff', fontSize: '14px' }}
        >
          <option value="movie">Movie</option>
          <option value="book">Book</option>
        </select>

        {/* star picker in edit mode */}
        <div className="star-picker" style={{ marginBottom: '8px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= (hoveredStar || editRating) ? 'star filled' : 'star'}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setEditRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          style={{ width: '100%', marginBottom: '8px', padding: '10px', borderRadius: '8px', border: '2px solid #e8ecff', fontSize: '14px', height: '80px', fontFamily: 'inherit' }}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="save-btn" onClick={handleEdit}>Save</button>
          <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="review-card">
      <div className="card-header">
        <h3>{review.title}</h3>
        <span className="type-badge" data-type={review.type}>{review.type}</span>
      </div>

      <p className="stars">{stars}</p>
      <p className="review-text">{review.reviewText}</p>
      <p className="posted-by">— {review.userName}</p>

      {review.userName === currentUser && (
        <div className="card-actions">
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  )
}

export default ReviewCard