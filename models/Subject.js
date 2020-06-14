const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const StudySession = require("./StudySession");

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    targetHours: {
      type: Number,
      required: true,
    },
    frequencyBreaks: {
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
    progressHistory: Map,
  },
  { timestamps: true }
);

subjectSchema.methods.updateProgressHistory = async function () {
  let progressHistory = new Map();
  try {
    const studySessions = await StudySession.find({
      subject: this._id,
    });
    studySessions.forEach(session => {
      v = session.duration;
      v /= this.targetHours * 60;
      v *= 100;
      v = Math.fround(v);
      const key = moment(session.date)
        .startOf("isoWeek")
        .toISOString()
        .replace(/\./g, "-");

      if (progressHistory.has(key)) {
        progressHistory.set(key, progressHistory.get(key) + v);
      } else {
        progressHistory.set(key, v);
      }
    });
    this.progressHistory = progressHistory;
    await this.save();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};

module.exports = mongoose.model("Subject", subjectSchema);
