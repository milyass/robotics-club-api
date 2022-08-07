const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
  Create: async ({ username, password }) =>
    User.findOneAndUpdate(
      {
        username,
      },
      {
        username,
        password: await bcrypt.hash(password, 10),
      },
      {
        upsert: true,
        new: true,
      }
    ),
  Find: async () => User.find(),
};
