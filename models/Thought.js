const mongoose = require("mongoose");
const { Schema } = mongoose;

const thoughtSchema = new Schema(
  {
    text: { type: String, required: [true, 'A task is required']}, 
    date: { type: Date, default: Date.now },
    user_id: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thought", thoughtSchema);