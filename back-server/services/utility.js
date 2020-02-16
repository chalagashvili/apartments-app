const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const SGmail = require('@sendgrid/mail');

const { Types } = mongoose;
const { ObjectId } = Types;

SGmail.setApiKey(process.env.SENDGRID_API_KEY);

exports.tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp,
    exp: Math.round(Date.now() + 1000 * 3600 * 12 * 10000000000),
    // 12 hours @TODO remove last multiplier
  }, process.env.SECRET);
};

exports.generatePassword = (length = 8) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

exports.validateObjectID = (id) => ObjectId.isValid(id);

exports.sendEmail = ({
  to, fromEmail, subject, text, fromName,
}) => {
  const message = {
    to,
    from: { email: fromEmail, name: fromName },
    text,
    subject,
  };

  return new Promise((resolve, reject) => {
    SGmail.send(message)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};
