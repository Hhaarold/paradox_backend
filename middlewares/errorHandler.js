const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  if (process.env.NODE_ENV === 'production') {
    return res.status(statusCode).json({ message });
  }

  console.error(err);
  return res.status(statusCode).json({
    message,
  });
};

module.exports = errorHandler;
