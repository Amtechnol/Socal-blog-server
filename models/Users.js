const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: {
        unique: true,
      },
      validate: {
        validator: isEmailExists,
        msg: "Email already exists",
      },
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

function isEmailExists(email, callback) {
  if (email) {
    mongoose.models["users"].count(
      { _id: { $ne: this._id }, email: email },
      function (err, result) {
        if (err) {
          return callback(err);
        }
        callback(!result);
      }
    );
  }
}

module.exports = mongoose.model("User", UserSchema);
