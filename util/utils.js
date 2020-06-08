const crypto = require("crypto");
const bcrypt = require("bcryptjs");

exports.generateToken = size => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, buffer) => {
      if (err) reject(err);
      const token = buffer.toString("hex");
      resolve(token);
    });
  });
};

exports.encryptString = string => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(string, 12, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
