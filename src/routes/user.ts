import express from 'express';
import { check } from 'express-validator';

const router = express.Router();

import User from '../models/User';
import * as UserController from '../controllers/user';

import isAuth from '../middleware/is-auth';

const NAME_MIN_LENGTH = 3;
const PWD_MIN_LENGTH = 6;

router.post(
  '/signup',
  [
    check('email')
      .trim()
      .isEmail()
      .withMessage('The email address is not valid.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject('The email address already exists.');
          }
        });
      }),
    check('password')
      .trim()
      .isLength({ min: PWD_MIN_LENGTH })
      .withMessage(
        `The password needs to be at least ${PWD_MIN_LENGTH} characters long.`
      ),
    check('firstName')
      .trim()
      .isLength({ min: NAME_MIN_LENGTH })
      .withMessage(
        `The first name has to be at least ${NAME_MIN_LENGTH} characters long.`
      ),
    check('lastName')
      .trim()
      .isLength({ min: NAME_MIN_LENGTH })
      .withMessage(
        `The last name has to be at least ${NAME_MIN_LENGTH} characters long.`
      ),
  ],
  UserController.signup
);

router.post(
  '/login',
  [
    check('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email.'),
  ],
  UserController.login
);

router.get('/users', isAuth, UserController.show);

// Deletes the authenticated user
router.delete('/users', isAuth, UserController.destroy);

router.get('/users/progressHistory', isAuth, UserController.progressHistory);

router.patch('/users/changepassword', isAuth, UserController.changePassword);

export default router;
