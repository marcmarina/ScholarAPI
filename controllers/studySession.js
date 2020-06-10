const { validationResult } = require("express-validator");
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
};
