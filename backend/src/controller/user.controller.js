const userService = require('../services/user.service');

const register = async (req, res) => {
  try {
    await userService.registerUser(req.body);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Registration failed' });
  }
};

module.exports = {
  register
};