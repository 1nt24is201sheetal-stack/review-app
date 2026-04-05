// bring in the packages we installed
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

// create the app
const app = express()

// allow frontend to talk to backend
app.use(cors())

// allow the app to read JSON data from requests
app.use(express.json())

// connect to MongoDB using the link in .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('Connection error:', err))

// tell the app which routes to use
const authRoutes = require('./routes/auth')
const reviewRoutes = require('./routes/reviews')

app.use('/api/auth', authRoutes)
app.use('/api/reviews', reviewRoutes)

// start the server on port 5000
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})