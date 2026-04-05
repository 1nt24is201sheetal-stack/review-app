const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const authMiddleware = require('../middleware/auth')

// GET all reviews
router.get('/', async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 })
  res.json(reviews)
})

// POST a new review
router.post('/', authMiddleware, async (req, res) => {
  const { title, type, rating, reviewText } = req.body

  const review = new Review({
    title,
    type,
    rating,
    reviewText,
    userName: req.user.name,
    userId: req.user.id
  })

  await review.save()
  res.json(review)
})

// EDIT a review
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, type, rating, reviewText } = req.body

  const updated = await Review.findByIdAndUpdate(
    req.params.id,
    { title, type, rating, reviewText },
    { new: true }  // return the updated version
  )

  res.json(updated)
})

// DELETE a review
router.delete('/:id', authMiddleware, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id)
  res.json({ message: 'Review deleted' })
})

module.exports = router