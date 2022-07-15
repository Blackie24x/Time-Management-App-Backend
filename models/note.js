const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  fontSize: { type: Number, required: true },
  content: { type: String, required: true },
  align: { type: String, required: true },
  fontColor: { type: String, required: true },
  isItalic: { type: Boolean, required: true },
  isBold: { type: Boolean, required: true },
  id: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

// taskSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Note", noteSchema);
