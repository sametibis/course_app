class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message); // Include Error class (name, message, stack)
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
