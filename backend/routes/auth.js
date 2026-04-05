const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// REGISTER — POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  // check if email already exists
  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(400).json({ message: 'Email already in use' })
  }

  // encrypt the password (10 = how strong the encryption is)
  const hashedPassword = await bcrypt.hash(password, 10)

  // save the new user to the database
  const user = new User({ name, email, password: hashedPassword })
  await user.save()

  // create a token with their info — expires in 7 days
  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  // send back the token and name
  res.json({ token, name: user.name })
})

// LOGIN — POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  // find the user by email
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ message: 'No account with that email' })
  }

  // compare the typed password with the saved encrypted one
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ message: 'Wrong password' })
  }

  // create and send the token
  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ token, name: user.name })
})

module.exports = router