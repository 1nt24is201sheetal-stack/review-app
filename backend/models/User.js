const mongoose = require('mongoose')

// a "schema" is just the shape/structure of the data
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },  // no two users can have same email
  password: String,                        // this will be stored encrypted
  createdAt: { type: Date, default: Date.now }
})

// export it so other files can use it
module.exports = mongoose.model('User', userSchema)