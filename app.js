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
    app.listen(8080);
  })
  .catch(err => console.log(err));
