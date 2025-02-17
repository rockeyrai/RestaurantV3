const { mysqlPool } = require("../database/mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// API Routes
// SignUp
const userRegister = async (req, res) => {
  console.log('Request received:', req.body);
  const { username, email, password, phone_number, role = 'customer' } = req.body;

  try {
    // Check if user already exists in MySQL
    const [results] = await mysqlPool.query('SELECT * FROM Users WHERE email = ?', [email]);
    console.log('SELECT query results:', results);

    if (results.length > 0) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully:', hashedPassword);

    // Insert user into MySQL
    const [insertResult] = await mysqlPool.query(
      'INSERT INTO Users (username, email, password_hash, phone_number, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone_number, role]
    );

    console.log('INSERT query result:', insertResult);

    // Generate JWT token
    const token = generateToken(insertResult.insertId);
    console.log('Token generated:', token);

    return res.status(201).json({ message: 'User created', token });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Error during signup' });
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