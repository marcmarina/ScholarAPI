import mongoose, { Schema, Document } from 'mongoose';
import { ISubject } from './Subject';

export interface IStudySession extends Document {
  duration: number;
  date: Date;
  subject: ISubject['_id'];
}

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
    ref: 'Subject',
  },
});

export default mongoose.model<IStudySession>(
  'StudySession',
  studySessionSchema
);
