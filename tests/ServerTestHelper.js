/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken() {
    const payloadUser = {
      id: 'user-123',
      username: 'dicoding',
    };

    await UsersTableTestHelper.addUser(payloadUser);
    return Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServerTestHelper;
