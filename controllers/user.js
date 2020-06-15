const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Subject = require("../models/Subject");
const StudySession = require("../models/StudySession");

const ErrorHandler = require("../util/error-handler");
const Utils = require("../util/utils");
const env = require("../util/env");

exports.login = async (req, res, next) => {
  const errorHandler = new ErrorHandler(validationResult(req));

  if (errorHandler.errors.size > 0) {
    return res.status(422).json({
      errors: errorHandler.getErrors(),
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      errorHandler.addError(
        "credentials",
        "These credentials do not match our records."
      );
      return res.status(404).json({ errors: errorHandler.getErrors() });
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (isEqual) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        env.getSecretKey()
      );
      return res.status(200).json({ userId: user._id, token: token });
    } else {
      errorHandler.addError(
        "credentials",
        "These credentials do not match our records."
      );
      return res.status(404).json({ errors: errorHandler.getErrors() });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  const errorHandler = new ErrorHandler(validationResult(req));

  if (errorHandler.errors.size > 0) {
    return res.status(422).json({
      errors: errorHandler.getErrors(),
    });
  }
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  try {
    const encryptedPassword = await Utils.encryptString(password);
    const user = new User({
      email: email,
      password: encryptedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    const storedUser = await user.save();
    res.status(201).json(storedUser);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Shows the info of the authenticated user
exports.show = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("subjects");
    if (!user)
      return res.status(404).json({ errors: { user: ["User not found."] } });
    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const subjectIds = [...user.subjects];

    const studySessions = await StudySession.find({
      subject: {
        $in: subjectIds,
      },
    });
    const studySessionIds = studySessions.map(i => i._id);

    await StudySession.deleteMany({ _id: { $in: studySessionIds } });
    await Subject.deleteMany({ _id: { $in: subjectIds } });
    await user.remove();
    res.status(200).json();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.progressHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json(Object.fromEntries(user.progressHistory));
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ errors: { user: ["User not found."] } });

    const isEqual = await bcrypt.compare(req.body.oldPassword, user.password);

    if (isEqual) {
      user.password = await Utils.encryptString(req.body.newPassword);
    } else {
      return res.status(403).json({
        errors: { oldPassword: ["The current password is wrong."] },
      });
    }

    await user.save();
    return res.status(204).json();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
