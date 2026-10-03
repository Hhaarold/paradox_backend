const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateObjectId = (fieldName, location = 'param') => {
  const validator = location === 'body'
    ? body(fieldName)
    : location === 'query'
      ? query(fieldName)
      : param(fieldName);

  return validator.custom((value) => {
    if (!isObjectId(value)) {
      throw new Error('ID inválido');
    }
    return true;
  });
};

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  return next();
};

module.exports = {
  isObjectId,
  validateObjectId,
  handleValidationErrors,
};
