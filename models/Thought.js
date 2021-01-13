const mongoose = require("mongoose");
const { Schema } = mongoose;

const thoughtSchema = new Schema(
  {
    text: String, 
    date: Date,
    user_id: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thought", thoughtSchema);