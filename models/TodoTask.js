const mongoose = require("mongoose");
// schema for each todo task (we use this to format our data when pushing to MongoDB)
const todoTaskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("TodoTask", todoTaskSchema);
