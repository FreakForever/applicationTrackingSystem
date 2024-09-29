// responseUtils.js
const sendSuccess = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  
  const sendError = (res, statusCode, error) => {
    res.status(statusCode).json({
      success: false,
      message: error,
    });
  };
  
  module.exports = {
    sendSuccess,
    sendError,
  };
  