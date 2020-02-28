const { matchedData, validationResult } = require('express-validator');
const { validationError } = require('../services/apiResponse');

const validateResults = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    req.matchedData = matchedData(req);
    return next();
  }
  let extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));
  extractedErrors = extractedErrors.join(', ');
  return validationError(res, extractedErrors);
};

module.exports = { validateResults };
