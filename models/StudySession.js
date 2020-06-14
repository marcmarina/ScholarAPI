const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const studySessionSchema = new Schema({
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
  },
});

module.exports = mongoose.model("StudySession", studySessionSchema);
