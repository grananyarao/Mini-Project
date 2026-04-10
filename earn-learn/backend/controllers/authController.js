const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPass, role });
    await user.save();
    res.status(201).json({ message: 'User Registered Successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


