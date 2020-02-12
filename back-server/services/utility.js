import jwt from 'jwt-simple';

exports.tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp,
    exp: Math.round(Date.now() + 1000 * 3600 * 12), // 12 hours
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
