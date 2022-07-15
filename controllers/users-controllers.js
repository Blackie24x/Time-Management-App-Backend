const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return next(new Error("Invalid inputs passed"));
  }
  const { name, password, email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new Error("Signing up failed"));
  }

  if (existingUser) {
    return next(new Error("User exists already"));
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new Error("Could not create user"));
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    tasks: [],
    doneTasks: 0,
    totalFocus: 0,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new Error("Signing up failed"));
  }

  // let token;
  // try {
  //   token = jwt.sign(
  //     { userId: createdUser.id, email: createdUser.email },
  //     "token",
  //     { expiresIn: "1h" }
  //   );
  // } catch (err) {
  //   return next(new Error("Signing up failed"));
  // }

  res.json({ userId: createdUser.id, email: createdUser.email });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new Error("Logging in failed"));
  }
  if (!existingUser) {
    return next(new Error("Invalid credentials"));
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(new Error("Could not log you in"));
  }

  if (!isValidPassword) return next(new Error("Invalid credentials"));

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    doneTasks: existingUser.doneTasks,
    totalFocus: existingUser.totalFocus,
  });
};

const updateStats = async (req, res, next) => {
  const { doneTasks, totalFocus, userId } = req.body;
  console.log(doneTasks, totalFocus);
  let user;
  try {
    user = await User.findOne({ id: userId });
    user.doneTasks = doneTasks;
    user.totalFocus = totalFocus;
  } catch (err) {
    return next(new Error("Something went wrong"));
  }
  try {
    await user.save();
  } catch (err) {
    return next(new Error("Something went wrong"));
  }
  res.json({});
};
exports.signup = signup;
exports.login = login;
exports.updateStats = updateStats;
