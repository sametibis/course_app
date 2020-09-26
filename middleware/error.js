const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(err);

  // ObjectID Errors:
  if (err.name === 'CastError') {
    const message = `Resource not found with id of: ${err.value} `;
    // value => id
    error = new ErrorResponse(message, 404);
  }

  // Duplicated fields errors:
  if (err.code === 11000) {
    const message = `Duplicate field! There is already a bootcamp with this name: ${err.keyValue.name}`;

    error = new ErrorResponse(message, 400);
  }

  // Validation errors:
  if (err.name === 'ValidationError') {
    // err.errors => Object array
    const message = Object.values(err.errors).map((e) => e.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    msg: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
