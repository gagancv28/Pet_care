const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.name, '-', err.message);

  if (err.name === 'ValidationError') {
    const errors = {};
    Object.keys(err.errors).forEach(key => {
      errors[key] = err.errors[key].message;
    });
    return res.status(400).json({ success: false, errors });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format provided' });
  }

  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'Duplicate entry detected' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
