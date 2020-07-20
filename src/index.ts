import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import { UserRoutes, SubjectRoutes, StudySessionRoutes } from './routes';
import { getMongoDBUri, getPort } from './utils/env';
import CustomError from './utils/CustomError';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res, next) => {
  const response = require('../package.json');
  delete response['repository'];
  res.status(200).json(response);
});

app.use(UserRoutes);
app.use(SubjectRoutes);
app.use(StudySessionRoutes);

app.use((error: CustomError, req, res, next) => {
  const status = error.statusCode || 500;
  let result = { server: [error.message] };
  if (error instanceof CustomError) {
    result = error.getErrors();
  }
  res.status(status).json({ errors: result });
});

mongoose
  .connect(getMongoDBUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(result => {
    app.listen(getPort() || 8080);
  })
  .catch(err => console.log(err));
