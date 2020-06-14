const mongoose = require("mongoose");
const Subject = require("./Subject");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerifiedAt: {
      type: Date,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getProgressHistory = async function () {
  try {
    const subjects = await Subject.find({ user: this._id });
    const progressHistory = new Map();
    for (s of subjects) {
      const subjectHistory = await s.getProgressHistory();
      subjectHistory.forEach((v, k) => {
        v = v > 100 ? 100 : v;
        v /= subjects.length;
        v = Math.fround(v);
        if (progressHistory.has(k)) {
          progressHistory.set(k, progressHistory.get(k) + v);
        } else {
          progressHistory.set(k, v);
        }
      });
    }
    return progressHistory;
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};

module.exports = mongoose.model("User", userSchema);
