import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import { UserRoutes, SubjectRoutes, StudySessionRoutes } from './routes';
import { getMongoDBUri, getPort } from './utils/env';

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

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    errors: {
      server: [message],
    },
  });
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
