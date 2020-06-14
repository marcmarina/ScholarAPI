const { validationResult } = require("express-validator");
const User = require("../models/User");
const Subject = require("../models/Subject");

const ErrorHandler = require("../util/error-handler");

exports.index = async (req, res, next) => {
  const errorHandler = new ErrorHandler(validationResult(req));

  if (errorHandler.errors.size > 0)
    return res.status(401).json({ errors: errorHandler.getErrors() });

  try {
    const subjects = await Subject.find({ user: req.userId });
    res.status(200).json(subjects);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const errorHandler = new ErrorHandler(validationResult(req));

  if (errorHandler.errors.size > 0)
    return res.status(422).json({ errors: errorHandler.getErrors() });

  const name = req.body.name;
  const targetHours = req.body.targetHours;
  const frequencyBreaks = req.body.frequencyBreaks;

  try {
    const subject = new Subject({
      name: name,
      targetHours: targetHours,
      user: req.userId,
      frequencyBreaks: frequencyBreaks,
    });

    const savedSubject = await subject.save();
    const user = await User.findById(req.userId);

    user.subjects.push(savedSubject._id);
    await user.save();

    res.status(201).json(savedSubject);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// Returns all subjects for the authenticated user
exports.show = async (req, res, next) => {
  const errorHandler = new ErrorHandler();
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      errorHandler.addError("subject", "Subject not found.");
      return res.status(404).json({ errors: errorHandler.getErrors() });
    }
    res.status(200).json(subject);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.progressHistory = async (req, res, next) => {
  const subjectId = req.params.subjectId;
  try {
    const subject = await Subject.findById(subjectId);
    if (!subject)
      return res.status(404).json({ errors: ["Subject not found."] });

    await subject.updateProgressHistory();

    return res.json({ a: "b" });
    res
      .status(200)
      .json(Object.fromEntries(await subject.getProgressHistory()));
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
