import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
    unique: true
  },

  mobile: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 10,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
