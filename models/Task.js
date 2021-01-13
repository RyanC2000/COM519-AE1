const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    text: String,
    deadline: Date,
    user_id: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);