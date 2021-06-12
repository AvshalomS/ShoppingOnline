const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  mail: { type: String },
  ID: {
    type: String,
    index: true,
    unique: true,
  },
  password: { type: String },
  role: { type: String },
  city: { type: String },
  street: { type: String }
});

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
