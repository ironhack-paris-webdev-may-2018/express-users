const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const roomSchema = new Schema({
  // document structure & rules definition here
  name: { type: String, required: true },
  description: { type: String, required: true },
  pictureUrl: { type: String, required: true },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",  // tells Mongoose that this ID connects to the User model
    required: true
  }
}, {
  // additional settings for the schema here
  timestamps: true
});

const Room = mongoose.model("Room", roomSchema);


module.exports = Room;
