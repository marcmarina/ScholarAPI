const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const studySessionController = require("../controllers/studySession");

const isAuth = require("../middleware/is-auth");

// Returns all sessions for a given subject
router.get("/studySessions/:subjectId", isAuth, studySessionController.index);

router.post(
  "/studySessions",
  isAuth,
  [
    check("duration")
      .isNumeric()
      .withMessage("The duration has to be a number."),
    check("date").custom((value, { req }) => {
      if (!Date.parse(value)) throw new Error("The date is not valid.");
      return true;
    }),
  ],
  studySessionController.create
);

module.exports = router;
