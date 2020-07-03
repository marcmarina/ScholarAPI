import mongoose, { Schema, Document } from 'mongoose';

import Subject from './Subject';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailVerifiedAt: Date;
  subjects: Array<Schema.Types.ObjectId>;
  progressHistory: Map<Date, number>;

  updateProgressHistory(): void;
}

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
        ref: 'Subject',
      },
    ],
    progressHistory: Map,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.updateProgressHistory = async function () {
  try {
    const subjects = await Subject.find({ user: this._id });
    const progressHistory = new Map();
    for (let s of subjects) {
      const subjectHistory = await s.progressHistory;
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
    this.progressHistory = progressHistory;
    await this.save();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};

export default mongoose.model<IUser>('User', userSchema);
