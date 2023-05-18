import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { logger } from "../logger/logger.js";

export const registerUser = async (req, res) => {
  logger.info(JSON.stringify(req.body));
  try {
    const { firstName, lastName, email, mobile, password } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const userAlreadyRegistered = await User.find({ email: email });
    if (userAlreadyRegistered.length > 0) {
      const response = {
        status: false,
        data: {
          errorMessage: "User already registered"
        }
      };
      logger.info(JSON.stringify(response));
      return res.status(409).json(response);
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: passwordHash
    });
    const savedUser = await newUser.save();
    const response = { status: true, data: savedUser };
    logger.info(JSON.stringify(response));
    res.status(201).json(response);
  } catch (err) {
    const errorResponse = { status: 500, data: { errorMessage: err.message } };
    logger.error(JSON.stringify(errorResponse));
    res
      .status(500)
      .json({ status: false, data: { errorMessage: err.message } });
  }
};

export const login = async (req, res) => {
  logger.info(JSON.stringify(req.body));
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      const response = {
        status: false,
        data: { errorMessage: "User does not exist." }
      };
      logger.info(JSON.stringify(response));
      return res.status(404).json(response);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const response = {
        status: false,
        data: { errorMessage: "Invalid credentials." }
      };
      logger.info(JSON.stringify(response));
      return res.status(400).json(response);
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    const response = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile
    };
    logger.info(JSON.stringify(response));
    res.status(200).json({ status: true, data: { token, user: response } });
  } catch (err) {
    res.status(500).json({ status: true, data: { error: err.message } });
  }
};
