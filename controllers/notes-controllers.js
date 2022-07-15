const Note = require("../models/note");
const User = require("../models/user");
const mongoose = require("mongoose");

const getNotesByUserId = async (req, res, next) => {
  const userId = req.query.userId;

  let userWithNotes;
  try {
    userWithNotes = await User.findById(userId).populate("notes");
  } catch (err) {
    const error = new Error("Fetching notes failed");
    return next(error);
  }

  if (!userWithNotes) {
    return next(new Error("Could not find notes for the provided user id."));
  }
  res.json({
    notes: userWithNotes.notes.map((note) => note.toObject({ getters: true })),
  });
};

const createNote = async (req, res, next) => {
  const {
    title,
    content,
    fontSize,
    fontColor,
    align,
    isBold,
    isItalic,
    id,
    userId,
  } = req.body;
  console.log(req.body);
  const createdNote = new Note({
    title,
    content,
    fontSize,
    fontColor,
    align,
    isBold,
    isItalic,
    id,
    creator: userId,
  });

  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new Error("Creating note failed");
    return next(error);
  }

  if (!user) return next("Could not find user");
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdNote.save({ session: sess });
    user.notes.push(createdNote);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new Error("Creating note failed, please try again.");

    return next(error);
  }

  res.json({ note: createdNote });
};

const deleteNote = async (req, res, next) => {
  console.log(req.body);
  const { id, userId } = req.body;
  let note;
  try {
    note = await Note.findOne({ id }).populate("creator");
  } catch (err) {
    return next(new Error("Something went wrong"));
  }
  if (!note) return next(new Error("Could not find note"));

  if (note.creator.id !== userId)
    return next(new Error("You are not allowed to delete this note"));
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await note.remove({ session: sess });
    note.creator.notes.pull(note);
    await note.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new Error("Couldn't delete note"));
  }

  res.json({ message: "Note was deleted" });
};

const updateNote = async (req, res, next) => {
  const {
    title,
    content,
    fontSize,
    fontColor,
    align,
    isBold,
    isItalic,
    id,
    userId,
  } = req.body;
  console.log(id);
  let note;
  try {
    note = await Note.findOne({ id: id });
    // console.log(task);
    note.title = title;
    note.content = content;
    note.fontSize = fontSize;
    note.fontColor = fontColor;
    note.align = align;
    note.isBold = isBold;
    note.isItalic = isItalic;
    // task.complete = complete;
    // task.priority = priority;
    // console.log(task);
  } catch (err) {
    return next(new Error("Something went wrong"));
  }
  try {
    await note.save();
  } catch (err) {
    return next(new Error("Something went wrong"));
  }
  res.json({ note: note.toObject({ getters: true }) });
};

exports.getNotesByUserId = getNotesByUserId;
exports.createNote = createNote;
exports.deleteNote = deleteNote;
exports.updateNote = updateNote;
