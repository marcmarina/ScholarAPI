import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import Subject from '../models/Subject';
import StudySession from '../models/StudySession';

import ErrorHandler from '../utils/error-handler';
import CustomError from '../utils/CustomError';
import * as Utils from '../utils/utils';
import { getSecretKey } from '../utils/env';

export const login = async (req, res, next) => {
  const errorHandler = new ErrorHandler(validationResult(req));

  try {
    if (errorHandler.errors.size > 0) {
      const error = new CustomError(errorHandler.getErrors());
      throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      errorHandler.addError(
        'credentials',
        'These credentials do not match our records.'
      );
      throw new CustomError(errorHandler.getErrors());
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (isEqual) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        getSecretKey()
      );
      return res.status(200).json({ userId: user._id, token: token });
    } else {
      errorHandler.addError(
        'credentials',
        'These credentials do not match our records.'
      );
      throw new CustomError(errorHandler.getErrors());
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const signup = async (req, res, next) => {
  const errorHandler = new ErrorHandler(validationResult(req));

  if (errorHandler.errors.size > 0)
    throw new CustomError(errorHandler.getErrors(), 422);

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
export const show = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('subjects');
    if (!user) {
      const errorHandler = new ErrorHandler();
      errorHandler.addError('user', 'User not found.');
      throw new CustomError(errorHandler.getErrors(), 404);
    }
    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export const destroy = async (req, res, next) => {
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

export const progressHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json(user.progressHistory);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  const errorHandler = new ErrorHandler();
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      errorHandler.addError('user', 'User not found.');
      throw new CustomError(errorHandler.getErrors(), 404);
    }

    const isEqual = await bcrypt.compare(req.body.oldPassword, user.password);

    if (isEqual) {
      user.password = await Utils.encryptString(req.body.newPassword);
    } else {
      errorHandler.addError('oldPassword', 'The current password is wrong.');
      throw new CustomError(errorHandler.getErrors(), 403);
    }

    await user.save();
    return res.status(204).json();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
