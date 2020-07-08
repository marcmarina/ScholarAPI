import { validationResult } from 'express-validator';
import moment from 'moment';

import StudySession from '../models/StudySession';
import Subject from '../models/Subject';
import ErrorHandler from '../utils/error-handler';
import User from '../models/User';
import CustomError from '../utils/CustomError';

// Get all the sessions for the given subject
export const index = async (req, res, next) => {
  const subjectId = req.params.subjectId;

  try {
    const subject = await Subject.findById(subjectId).populate('studySessions');
    if (!subject) {
      const errorHandler = new ErrorHandler();
      errorHandler.addError('subject', 'Subject not found.');
      throw new CustomError(errorHandler.getErrors(), 404);
    }

    res.status(200).json(subject.studySessions);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export const create = async (req, res, next) => {
  const errorHandler = new ErrorHandler(validationResult(req));
  if (errorHandler.errors.size > 0)
    throw new CustomError(errorHandler.getErrors(), 422);

  const subjectId = req.body.subjectId;
  const duration = req.body.duration;
  const date = moment(req.body.date).toDate();

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      errorHandler.addError('studySession', 'Session not found.');
      throw new CustomError(errorHandler.getErrors(), 404);
    }

    const user = await User.findById(req.userId);

    const session = new StudySession({
      duration: duration,
      date: date,
      subject: subjectId,
    });
    const result = await session.save();
    subject.studySessions.push(result._id);
    await subject.save();
    await subject.updateProgressHistory();
    await user.updateProgressHistory();
    res.status(201).json();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export const destroy = async (req, res, next) => {
  const studySessionId = req.params.studySessionId;
  try {
    const studySession = await StudySession.findById(studySessionId);
    if (!studySession) {
      const errorHandler = new ErrorHandler();
      errorHandler.addError('studySession', 'Session not found.');
      throw new CustomError(errorHandler.getErrors(), 404);
    }

    const subject = await Subject.findById(studySession.subject);
    subject.studySessions = subject.studySessions.filter(
      i => i != studySession.id
    );
    await subject.save();
    await studySession.remove();
    res.status(200).json();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
