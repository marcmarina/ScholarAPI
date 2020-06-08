const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  targetHours: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  studySessions: [
    {
      type: Schema.Types.ObjectId,
      ref: "StudySession",
    },
  ],
});

module.exports = mongoose.model("Subject", subjectSchema);
