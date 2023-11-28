const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
  gender: String,
  dob: Date,
  mobile: String,
});

// User model
const User = mongoose.model('User', userSchema);

// Signup API
app.post('/api/signup', async (req, res) => {
  const { name, email, password, age, gender, dob, mobile } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
 
if (userExists) { return res.status(400).json({ message: 'User already exists' }); }

// Hash password 
const salt = await bcrypt.genSalt(10); const hashedPassword = await bcrypt.hash(password, salt);

// Create new user
const newUser = new User({ name, email, password: hashedPassword, age, gender, dob, mobile, });

// Save user to database 
try { const savedUser = await newUser.save(); res.status(200).json(savedUser); } catch (error) { console.log(error); res.status(500).json({ message: 'Error saving user to database' }); } });

// Login API 
app.post('/api/login', async (req, res) => { const { email, password } = req.body;

// Check if user exists 
const user = await User.findOne({ email }); if (!user) { return res.status(400).json({ message: 'Invalid email or password' }); }

// Check if password is correct 
const isMatch = await bcrypt.compare(password, user.password); if (!isMatch) { return res.status(400).json({ message: 'Invalid email or password' }); }

// Generate JWT token const token = jwt.sign({ userId: user._id }, 'ecret');

res.status(200).json({ token }); });

// User API 
app.get('/api/user', async (req, res) => { const { token } = req.headers;

// Verify JWT token 
jwt.verify(token, 'ecret', (err, decoded) => { if (err) { return res.status(401).json({ message: 'Unauthorized' }); }

// Get user from database
User.findById(decoded.userId, (err, user) => {
  if (err) {
    return res.status(500).json({ message: 'Error fetching user from database' });
  }

  res.status(200).json(user);
});
}); });

app.put('/api/user', async (req, res) => { const { token } = req.headers; const { name, email, age, gender, dob, mobile } = req.body;

// Verify JWT token 
jwt.verify(token, 'ecret', (err, decoded) => { if (err) { return res.status(401).json({ message: 'Unauthorized' }); }

// Update user in database
User.findByIdAndUpdate(decoded.userId, {
  name,
  email,
  age,
  gender,
  dob,
  mobile,
}, { new: true }, (err, user) => {
  if (err) {
    return res.status(500).json({ message: 'Error updating user in database' });
  }

  res.status(200).json(user);
});
}); });

// Start server 
const port = process.env.PORT || 5000; app.listen(port, () => { console.log(`Server started on port ${port}`); });