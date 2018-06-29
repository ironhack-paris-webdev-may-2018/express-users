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
  role: {
    type: String,
    enum: [ "normal", "admin" ],
    default: "normal",
    required: true
  },

  // only for users who signed up normally
  encryptedPassword: { type: String },

  // only for users who log in with Google
  googleID: { type: String },

  // only for users who log in with GitHub
  githubID: { type: String }
}, {
  // additional settings for the schema here
  timestamps: true
});

// define the "isAdmin" virtual property
// CAN'T be an arrow function because it uses "this"
userSchema.virtual("isAdmin").get(function () {
  return this.role === "admin";
});

const User = mongoose.model("User", userSchema);


module.exports = User;
