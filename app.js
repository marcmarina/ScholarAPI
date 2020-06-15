const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const ErrorHandler = require("./util/error-handler");
const env = require("./util/env");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (req, res, next) => {
  let response = require("./package.json");
  delete response["repository"];
  res.status(200).json(response);
});

const userRoutes = require("./routes/user");
app.use(userRoutes);

const subjectRoutes = require("./routes/subject");
app.use(subjectRoutes);

const studySessionRoutes = require("./routes/studySession");
app.use(studySessionRoutes);

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
  .connect(env.getMongoDBUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(result => {
    app.listen(env.getPort() || 8080);
  })
  .catch(err => console.log(err));
