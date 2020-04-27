const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');

//Initialising express app

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRoutes');

const app = express();

//Setting View Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middlewares

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//For sending data from frontend to backend
app.use(cors());

//Set security HTTP headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//To restrict too many requests from single IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again latter.'
});
app.use('/api/', limiter);

//Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS(Cross Site Scripting)
app.use(xss());

//Routes

// Views Routes
app.get('/', (req, res) => {
  res.status(200).render('index');
});
app.get('/signup', (req, res) => {
  res.status(200).render('signup');
});

app.get('/login', (req, res) => {
  res.status(200).render('login');
});

app.use('/api/v1/users', userRouter);

//Handling unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Could not find ${req.originalUrl} on this server.`, 404));
});

//Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
