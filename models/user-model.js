const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userSchema = new Schema({
  // document structure & rules definition here
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^.+@.+\..+$/
  },
  encryptedPassword: { type: String, required: true }
}, {
  // additional settings for the schema here
  timestamps: true
});

const User = mongoose.model("User", userSchema);


module.exports = User;
