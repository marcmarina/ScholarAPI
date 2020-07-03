import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const generateToken = size => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, buffer) => {
      if (err) reject(err);
      const token = buffer.toString('hex');
      resolve(token);
    });
  });
};

export const encryptString = (string: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(string, 12, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const mapToJSON = (map: Map<any, any>) => {
  let obj = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};
