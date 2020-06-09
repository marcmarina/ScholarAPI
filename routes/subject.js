const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const subjectController = require("../controllers/subject");

const isAuth = require("../middleware/is-auth");

const NAME_MIN_LENGTH = 3;

router.get("/subjects", isAuth, subjectController.index);

router.get("/subjects/:subjectId", isAuth, subjectController.show);

router.post(
  "/subjects",
  isAuth,
  [
    check("name")
      .trim()
      .isLength({ min: NAME_MIN_LENGTH })
      .withMessage(
        `The name has to be at least ${NAME_MIN_LENGTH} characters long.`
      ),
    check("targetHours")
      .isNumeric()
      .withMessage("The target hours field has to be a number."),
    check("frequencyBreaks")
      .isNumeric()
      .withMessage("The frequency of breaks field must be a number."),
  ],
  subjectController.create
);

module.exports = router;
