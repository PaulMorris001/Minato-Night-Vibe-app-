/**
 * Standardized response utilities
 * Provides consistent error handling and response formatting
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, data = {}, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    message,
    ...data,
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 500)
 * @param {Error} error - Error object (optional)
 */
export const sendError = (res, message = "An error occurred", statusCode = 500, error = null) => {
  const response = { message };

  if (error && process.env.NODE_ENV !== "production") {
    response.error = error.message;
    response.stack = error.stack;
  }

  console.error(`Error [${statusCode}]:`, message, error);

  return res.status(statusCode).json(response);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Common error messages
 */
export const ErrorMessages = {
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "You don't have permission to perform this action",
  BAD_REQUEST: "Invalid request",
  SERVER_ERROR: "Internal server error",
  VALIDATION_ERROR: "Validation failed",
};

/**
 * Common success messages
 */
export const SuccessMessages = {
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",
  RETRIEVED: "Resource retrieved successfully",
};
