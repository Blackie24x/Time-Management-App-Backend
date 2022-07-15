const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: { type: String, required: true },
  priority: { type: Number, required: true },
  space: { type: String, required: true },
  theme: { type: String, required: true },
  complete: { type: Boolean, required: true },
  id: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

// taskSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Task", taskSchema);
