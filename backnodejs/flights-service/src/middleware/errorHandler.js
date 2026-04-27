const errorHandler = (err, req, res, next) => {
  const status = err.status || err.response?.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${status} - ${message}`);

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
