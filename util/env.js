const dotenv = require("dotenv").config();

exports.getMongoDBUri = () => process.env.MONGODB_URI;

exports.getSecretKey = () => process.env.APP_SECRET_KEY;

exports.getPort = () => process.env.PORT;
