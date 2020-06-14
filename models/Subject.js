const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const StudySession = require("./StudySession");

const subjectSchema = new Schema({
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
});

subjectSchema.methods.getProgressHistory = async function () {
  try {
    const progressHistory = new Map();
    const studySessions = await StudySession.find({ subject: this._id });

    studySessions.forEach(s => {
      let key;
      key = moment(s.date).startOf("isoWeek").toDate().toLocaleDateString();
      if (progressHistory.has(key)) {
        progressHistory.set(key, progressHistory.get(key) + s.duration);
      } else {
        progressHistory.set(key, s.duration);
      }
    });
    progressHistory.forEach((v, k, map) => {
      v /= this.targetHours * 60;
      v *= 100;
      v = Math.fround(v);
      map.set(k, v);
    });
    return progressHistory;
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};

subjectSchema.methods.updateProgressHistory = async function () {
  let progressHistory = new Map();
  try {
    const key = moment().startOf("isoWeek");

    const studySessions = await StudySession.find({
      subject: this._id,
      date: {
        $gte: key,
      },
    });
    studySessions.forEach(session => {
      v = session.duration;
      v /= this.targetHours * 60;
      v *= 100;
      v = Math.fround(v);
      let key = moment(session.date)
        .startOf("isoWeek")
        .toDate()
        .toLocaleDateString();
      if (progressHistory.has(key)) {
        progressHistory.set(key, progressHistory.get(key) + v);
      } else {
        progressHistory.set(key, v);
      }
    });
    this.progressHistory = progressHistory;
    console.log(progressHistory);
    await this.save();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};

module.exports = mongoose.model("Subject", subjectSchema);
