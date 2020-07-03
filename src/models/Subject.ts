import mongoose, { Schema, Document } from 'mongoose';
import moment from 'moment';

import StudySession from './StudySession';
import { IUser } from './User';
import { IStudySession } from './StudySession';

export interface ISubject extends Document {
  name: string;
  targetHours: number;
  frequencyBreaks: number;
  user: IUser['_id'];
  studySessions: Array<Schema.Types.ObjectId>;
  progressHistory: Map<Date, number>;

  updateProgressHistory(): void;
}

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
      ref: 'User',
    },
    studySessions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'StudySession',
      },
    ],
    progressHistory: Map,
  },
  { timestamps: true }
);

subjectSchema.methods.updateProgressHistory = async function () {
  let progressHistory = new Map(),
    v;
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
        .startOf('isoWeek')
        .toISOString()
        .replace(/\./g, '-');

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

export default mongoose.model<ISubject>('Subject', subjectSchema);
