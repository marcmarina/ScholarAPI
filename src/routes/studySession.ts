import express from 'express';
import { check } from 'express-validator';

const router = express.Router();

import * as StudySessionController from '../controllers/studySession';

import isAuth from '../middleware/is-auth';

// Returns all sessions for a given subject
router.get('/studySessions/:subjectId', isAuth, StudySessionController.index);

router.post(
  '/studySessions',
  isAuth,
  [
    check('duration')
      .isNumeric()
      .withMessage('The duration has to be a number.'),
    check('date').custom((value, { req }) => {
      if (!Date.parse(value)) throw new Error('The date is not valid.');
      return true;
    }),
  ],
  StudySessionController.create
);

router.delete(
  '/studySessions/:studySessionId',
  isAuth,
  StudySessionController.destroy
);

export default router;
