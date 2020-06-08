const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const User = require("../models/User");
const userController = require("../controllers/user");

const isAuth = require("../middleware/is-auth");

const NAME_MIN_LENGTH = 3;
const PWD_MIN_LENGTH = 6;

router.post(
  "/signup",
  [
    check("email")
      .trim()
      .isEmail()
      .withMessage("The email address is not valid.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("The email address already exists.");
          }
        });
      }),
    check("password")
      .trim()
      .isLength({ min: PWD_MIN_LENGTH })
      .withMessage(
        `The password needs to be at least ${PWD_MIN_LENGTH} characters long.`
      ),
    check("firstName")
      .trim()
      .isLength({ min: NAME_MIN_LENGTH })
      .withMessage(
        `The first name has to be at least ${NAME_MIN_LENGTH} characters long.`
      ),
    check("lastName")
      .trim()
      .isLength({ min: NAME_MIN_LENGTH })
      .withMessage(
        `The last name has to be at least ${NAME_MIN_LENGTH} characters long.`
      ),
  ],
  userController.signup
);

router.post(
  "/login",
  [
    check("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email."),
  ],
  userController.login
);

module.exports = router;
