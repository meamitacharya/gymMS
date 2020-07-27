const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handelDuplicateFieldsDB = err => {
  //Extracting name from errmsg
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);

  const message = `Duplicate field value : ${value[0]}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid Token. Please log in again.', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token expired.Please log in again.', 401);
};

const sendErrDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }
  // B) RENDERED WEBSITE
  console.log(err);
  return res.status(err.statusCode).render('error', {
    msg: err.message
  });
};

const sendErrProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api/')) {
    // a) Operational , trusted errors
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // b) Programming or other unknown error:Send abstract info

    // 1)Log the error in console
    console.error('ERROR:', err);

    // 2)Send Generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  }
  // B) RENDERED WEBSITE

  // a) Operational , trusted errors
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      msg: err.message
    });
  }
  // b) Programming or other unknown error:Send abstract info

  //1)Log the error in console
  console.error('ERROR:', err);

  //2)Send Generic message
  return res.status(err.statusCode).render('error', {
    msg: 'Please try again later'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handelDuplicateFieldsDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrProd(error, req, res);
  }
};
