const Task = require("../models/task");
const User = require("../models/user");
const mongoose = require("mongoose");

const getTasksByUserId = async (req, res, next) => {
  const userId = req.query.userId;

  let userWithTasks;
  try {
    userWithTasks = await User.findById(userId).populate("tasks");
  } catch (err) {
    const error = new Error("Fetching tasks failed");
    return next(error);
  }

  if (!userWithTasks) {
    return next(new Error("Could not find tasks for the provided user id."));
  }
  res.json({
    tasks: userWithTasks.tasks.map((task) => task.toObject({ getters: true })),
  });
};

const createTask = async (req, res, next) => {
  const { name, priority, complete, space, theme, id, userId } = req.body;
  console.log(id);
  const createdTask = new Task({
    name,
    priority,
    complete,
    space,
    theme,
    id,
    creator: userId,
  });

  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new Error("Creating task failed");
    return next(error);
  }

  if (!user) return next("Could not find user");

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdTask.save({ session: sess });
    user.tasks.push(createdTask);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error("Creating task failed, please try again.");

    return next(error);
  }

  res.json({ task: createdTask });
};
const deleteTask = async (req, res, next) => {
  const { taskId, userId } = req.body;
  let task;
  console.log(taskId);
  try {
    task = await Task.findOne({ id: taskId }).populate("creator");
    console.log(task);
  } catch (err) {
    return next(new Error("Something went wrong"));
  }
  if (!task) return next(new Error("Could not find task"));

  if (task.creator.id !== userId)
    return next(new Error("You are not allowed to delete this task"));
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await task.remove({ session: sess });
    task.creator.tasks.pull(task);
    console.log(task.creator.tasks);
    await task.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new Error("Couldn't delete task"));
  }

  res.json({ message: "Task was deleted" });
};
const updateTask = async (req, res, next) => {
  const { name, theme, priority, complete, id, space } = req.body;
  console.log(id);
  let task;
  try {
    task = await Task.findOne({ id: id });
    console.log(req.body, task);
    task.complete = complete;
    task.priority = priority;
    // console.log(task);
  } catch (err) {
    console.log(err);
    return next(new Error("Something went wrong"));
  }
  try {
    await task.save();
  } catch (err) {
    return next(new Error("Somethin went wrong"));
  }
  res.json({ task: task.toObject({ getters: true }) });
};
exports.getTasksByUserId = getTasksByUserId;
exports.createTask = createTask;
exports.deleteTask = deleteTask;
exports.updateTask = updateTask;
