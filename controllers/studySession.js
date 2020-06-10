const { validationResult } = require("express-validator");
const moment = require("moment");

const StudySession = require("../models/StudySession");
const Subject = require("../models/Subject");
const ErrorHandler = require("../util/error-handler");

// Get all the subjects for the given subject
exports.index = async (req, res, next) => {
  const subjectId = req.params.subjectId;

  try {
    const subject = await Subject.findById(subjectId).populate("studySessions");
    if (!subject)
      return res.status(404).json({
        errors: {
          subject: ["Subject not found."],
        },
      });

    res.status(200).json(subject.studySessions);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const errorHandler = new ErrorHandler(validationResult(req));
  if (errorHandler.errors.size > 0)
    return res.status(422).json({ errors: errorHandler.getErrors() });

  const subjectId = req.body.subjectId;
  const duration = req.body.duration;
  const date = moment(req.body.date).toDate();

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject)
      res.status(404).json({ errors: { subject: ["Subject not found."] } });
    const session = new StudySession({
      duration: duration,
      date: date,
      subject: subjectId,
    });
    const result = await session.save();
    subject.studySessions.push(result._id);
    await subject.save();
    res.status(201).json();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const studySessionId = req.params.studySessionId;
  try {
    const studySession = await StudySession.findById(studySessionId);
    if (!studySession)
      return res
        .status(404)
        .json({ errors: { studySession: ["Session not found."] } });

    const subject = await Subject.findById(studySession.subject);
    await StudySession.findByIdAndDelete(studySessionId);
    subject.studySessions.pull(studySession._id);
    await subject.save();
    res.status(200).json();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
