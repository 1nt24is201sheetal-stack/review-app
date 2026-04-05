const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  title: String,          // name of the book or movie
  type: String,           // "book" or "movie"
  rating: Number,         // 1 to 5
  reviewText: String,     // what the user wrote
  userName: String,       // who posted it
  userId: String,         // their ID (so we know it's theirs)
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Review', reviewSchema)