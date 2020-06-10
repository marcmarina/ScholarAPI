const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const studySessionController = require("../controllers/studySession");

const isAuth = require("../middleware/is-auth");

// Returns all sessions for a given subject
router.get("/studySessions/:subjectId", isAuth, studySessionController.index);

module.exports = router;
