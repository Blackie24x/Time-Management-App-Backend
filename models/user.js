const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: [{ type: mongoose.Types.ObjectId, required: true, ref: "Task" }],
  spaces: [{ type: mongoose.Types.ObjectId, required: true, ref: "Space" }],
  notes: [{ type: mongoose.Types.ObjectId, required: true, ref: "Note" }],

  doneTasks: { type: Number, required: true },
  totalFocus: { type: Number, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
