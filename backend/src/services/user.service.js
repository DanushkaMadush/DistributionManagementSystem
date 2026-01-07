const userRepository = require('../repositories/user.repository');
const { hashPassword } = require('../utils/password.util');

const registerUser = async (data) => {
  const passwordHash = await hashPassword(data.password);

  const user = {
    ...data,
    passwordHash
  };

  await userRepository.createUser(user);
};

module.exports = {
  registerUser
};