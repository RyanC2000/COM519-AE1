const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    text: { type: String, required: [true, 'A task is required']},
    deadline: { type: Date, default: Date.now },
    user_id: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);