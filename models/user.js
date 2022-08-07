const { Schema, model } = require("mongoose")

const UserSchema = new Schema({
    username: String,
    password: String
});

module.exports = model("User", UserSchema);