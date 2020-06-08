const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Subject = require("../models/Subject");

const ErrorHandler = require("../util/error-handler");
const Utils = require("../util/utils");
const env = require("../util/env");

exports.create = async (req, res, next) => {
  const errorHandler = new ErrorHandler(validationResult(req));

  if (errorHandler.errors.size > 0) {
    return res.status(401).json({
      errors: errorHandler.getErrors(),
    });
  }

  const name = req.body.name;
  const targetHours = req.body.targetHours;

  try {
    const subject = new Subject({
      name: name,
      targetHours: targetHours,
      user: req.userId,
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

exports.show = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    res.status(200).json(subject);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
