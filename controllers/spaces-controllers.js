const Space = require("../models/space");
const User = require("../models/user");
const mongoose = require("mongoose");

const createSpace = async (req, res, next) => {
  const { name, theme, userId } = req.body;
  console.log(userId);
  const createdSpace = new Space({
    name,
    theme,
    creator: userId,
  });

  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new Error("Creating space failed");
    return next(error);
  }

  if (!user) return next("Could not find user");

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdSpace.save({ session: sess });
    user.spaces.push(createdSpace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error("Creating space failed, please try again.");

    return next(error);
  }

  res.json({ space: createdSpace });
};
const getSpacesByUserId = async (req, res, next) => {
  const userId = req.query.userId;

  // let places;
  let userWithSpaces;
  try {
    userWithSpaces = await User.findById(userId).populate("spaces");
  } catch (err) {
    const error = new Error("Fetching spaces failed");
    return next(error);
  }

  console.log(userWithSpaces === true);
  if (!userWithSpaces) {
    return next(new Error("Could not find spaces for the provided user id."));
  }
  res.json({
    spaces: userWithSpaces.spaces.map((space) =>
      space.toObject({ getters: true })
    ),
  });
};

const deleteSpace = async (req, res, next) => {
  const { name, userId } = req.body;
  let space;
  console.log(name);
  try {
    space = await Space.findOne({ name: name }).populate("creator");
  } catch (err) {
    return next(new Error("Something went wrong"));
  }
  if (!space) return next(new Error("Could not find space"));

  if (space.creator.id !== userId)
    return next(new Error("You are not allowed to delete this space"));
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await space.remove({ session: sess });
    space.creator.spaces.pull(space);
    await space.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new Error("Couldn't delete space"));
  }

  res.json({ message: "Space was deleted" });
};

exports.createSpace = createSpace;
exports.getSpacesByUserId = getSpacesByUserId;
exports.deleteSpace = deleteSpace;
