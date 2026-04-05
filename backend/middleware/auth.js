const jwt = require('jsonwebtoken')

// this function runs before certain routes
function authMiddleware(req, res, next) {

  // get the token from the request header
  const authHeader = req.headers.authorization

  // if there's no token, stop here
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, not logged in' })
  }

  // the header looks like "Bearer abc123..." — we only want the "abc123..." part
  const token = authHeader.split(' ')[1]

  // check if the token is valid
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded   // attach user info to the request
    next()               // allow the request to continue
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = authMiddleware