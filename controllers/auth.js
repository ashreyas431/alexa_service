import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const userAlreadyRegistered = await User.find({ email: email });
    if (userAlreadyRegistered.length > 0) {
      return res.status(409).json({
        status: false,
        data: {
          errorMessage: "User already registered"
        }
      });
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: passwordHash
    });
    const savedUser = await newUser.save();
    res.status(201).json({ status: true, data: savedUser });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, data: { errorMessage: err.message } });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(404)
        .json({
          status: false,
          data: { errorMessage: "User does not exist." }
        });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({
          status: false,
          data: { errorMessage: "Invalid credentials." }
        });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    const responseJson = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile
    };
    res.status(200).json({ status: true, data: { token, user: responseJson } });
  } catch (err) {
    res.status(500).json({ status: true, data: { error: err.message } });
  }
};
