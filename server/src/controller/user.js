const { mysqlPool } = require("../database/mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Function to generate JWT token
const generateToken = (userId) => {
  const payload = { userId };
  const secret = process.env.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

const userRegister = async (req, res) => {
  console.log('Request received:', req.body);
  const { username, email, password, role = 'customer' } = req.body;

  try {
    // Check if user already exists in MySQL
    const [results] = await mysqlPool.query('SELECT * FROM Users WHERE email = ?', [email]);

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into MySQL
    const [insertResult] = await mysqlPool.query(
      'INSERT INTO Users (username, email, password_hash, role) VALUES (?,?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    console.log('INSERT query result:', insertResult);

    // Generate JWT token
    const token = generateToken(insertResult.insertId);
    console.log('Token generated:', token);

    // Return success response with token
    return res.status(201).json({ message: 'User created', token });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ message: 'Error during signup', error: error.message });
  }
};

// SignIn
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login request received:', req.body); // Log request body

  try {
    // Check if user exists
    const [results] = await mysqlPool.query('SELECT * FROM Users WHERE email = ?', [email]);
    console.log('User found:', results);

    if (results.length === 0) {
      console.log('Invalid email or password');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare password with the hashed one in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    console.log('Password comparison result:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      console.log('Invalid email or password');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user.user_id);
    console.log('Token generated:', token);

    return res.status(200).json({ message: 'Signed in successfully', token, user });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Database error during signin' });
  }
};


module.exports = {userRegister,userLogin}