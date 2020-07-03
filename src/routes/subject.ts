import express from 'express';
import { check } from 'express-validator';

const router = express.Router();

import * as SubjectController from '../controllers/subject';

import isAuth from '../middleware/is-auth';

const NAME_MIN_LENGTH = 3;

// Returns all subjects for the authenticated user
router.get('/subjects', isAuth, SubjectController.index);

router.get('/subjects/:subjectId', isAuth, SubjectController.show);

router.post(
  '/subjects',
  isAuth,
  [
    check('name')
      .trim()
      .isLength({ min: NAME_MIN_LENGTH })
      .withMessage(
        `The name has to be at least ${NAME_MIN_LENGTH} characters long.`
      ),
    check('targetHours')
      .isNumeric()
      .withMessage('The target hours field has to be a number.'),
    check('frequencyBreaks')
      .isNumeric()
      .withMessage('The frequency of breaks field must be a number.'),
  ],
  SubjectController.create
);

router.get(
  '/subjects/progressHistory/:subjectId',
  isAuth,
  SubjectController.progressHistory
);

export default router;
