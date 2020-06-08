const dotenv = require("dotenv").config();

exports.getMongoDBUri = () => process.env.MONGODB_URI;
