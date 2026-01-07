const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');

const login = async (email, password) => {
  const records = await authRepository.getUserWithRolesByEmail(email);

  if (!records.length) {
    throw new Error('Invalid email or password');
  }

  const user = records[0];

  const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const roles = records.map(r => r.RoleName);

  const token = jwt.sign(
    {
      userId: user.UserId,
      employeeId: user.EmployeeId,
      email: user.Email,
      roles
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token
  };
};

module.exports = {
  login
};