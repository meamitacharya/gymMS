const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const sendCookie = (token, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
};

const sendmail = async (user, message, next) => {
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your account verification token ',
      message
    });
  } catch (err) {
    return next(
      new AppError(
        'There was an error sending the email. Try again latter!',
        500
      )
    );
  }
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    panVatNumber: req.body.panVatNumber
  });

  // Generating Verification token
  const emailVerificationToken = newUser.createVerificationToken();
  await newUser.save({ validateBeforeSave: false });

  // Generating activation URL
  const activateURL = `${req.protocol}://${req.get(
    'host'
  )}/activate/${emailVerificationToken}`;

  const message = `Click the link to activate your account \n ${activateURL}`;

  // Sending Email to Registered User
  await sendmail(newUser, message, next);

  newUser.password = undefined;
  res.status(201).json({
    status: 'sucess',
    data: {
      user: newUser
    }
  });
});

exports.activate = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailverficationExpires: { $gt: Date.now() }
  });

  // 2) Check token is valid or not. if then update document
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // Changing  isConfirmed Vale and deleting token and expiration time from database
  user.isConfirmed = true;
  user.emailVerificationToken = undefined;
  user.emailverficationExpires = undefined;

  await user.save({ validateBeforeSave: false });

  // Sending Account activated page
  res.redirect('/accountActive');
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1)check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2)Check if the user exists and password is correct and account isaAtivated
  const user = await User.findOne({ email }).select('+password isConfirmed');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (user.isConfirmed === false) {
    return res
      .status(200)
      .json({ status: 'deactive', data: { user: user.isConfirmed } });
  }

  // 3) if everything ohk send client token

  const token = signToken(user._id);

  //Sending cookie
  sendCookie(token, res);

  //For clearing cookie
  // res.clearCookie('jwt');

  res.status(200).json({
    status: 'sucess',
    token,
    data: {
      user
    }
  });
});

exports.logout = (req, res) => {
  // Set token value to unauthentic token
  res.cookie('jwt', 'Logged-Out', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true // For development environment
  });

  res.status(200).json({
    status: 'sucess',
    message: 'Account Logged Out'
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1)getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in.Please login to get Acess', 401)
    );
  }
  // 2)Verification Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3)check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exist.', 401)
    );
  }

  // 4) check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401)
    );
  }

  //Contains currentUser Object
  req.user = currentUser;
  next();
});

// Only for rendered pages not to make errors
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 1) verifies the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2)check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a logged in user
      res.locals.user = currentUser; // To pass varibales to template
      return next();
    }
    next();
  } catch (err) {
    next();
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array:'admin','member', 'gym-owner
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not authorized to perfom action.', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  //2)Generate the random token
  user.passwordResetToken = Math.floor(1000 + Math.random() * 9000);
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(user.passwordResetToken);
  await user.save({ validateBeforeSave: false });

  const message = `Your password reset token is ${user.passwordResetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password reset token (valid for 10 minutes)',
      message
    });

    res.status(200).json({
      status: 'sucess',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again latter!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on token

  const user = await User.findOne({
    email: req.body.email,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  //2) If token not expired, and there is a user, set the new password

  if (!user) return next(new AppError('Token is invalid or has expired!', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  //3) Update  changedPasswordAt property  for the user

  // //4) Log the user in, send JWT
  // const token = signToken(user._id);

  // //Sending cookie
  // sendCookie(token, res);

  res.status(200).json({
    status: 'sucess'
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get current user
  const user = await User.findById(req.user.id).select('+password');

  //2) check if the POSTed password is correct
  if (!user.correctPassword(req.body.passwordCurrent, user.password))
    return next(new AppError('Your current password is not correct.', 401));

  //3) If so update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4) Log in user, send JWt

  const token = signToken(user._id);

  //Sending cookie
  sendCookie(token, res);

  res.status(200).json({
    status: 'sucess',
    token
  });
});
