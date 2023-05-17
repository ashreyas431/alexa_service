import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 2,
    max: 50
  },
  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 50
  },
  email: {
    type: String,
    required: true,
    min: 2,
    max: 50,
    unique: true
  },

  mobile: {
    type: String,
    required: true,
    min: 10,
    max: 10,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 8
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
