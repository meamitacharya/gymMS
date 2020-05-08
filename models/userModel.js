const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your  First name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  address: {
    type: String,
    required: [true, 'Please provide your address']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone Number']
  },
  panVatNumber: {
    type: String
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'member', 'gym-owner'],
    default: 'member'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false //never show this field in output
  },
  passwordChangedAt: Date,
  passwordConfirm: {
    type: String,
    minlength: 8,
    required: [true, 'Please confirm your password'],
    validate: {
      //checking for same password
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not same'
    }
  },
  passwordResetToken: Number,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  isConfirmed: {
    type: Boolean,
    default: false
    // select: false
  },
  emailVerificationToken: String,
  emailverficationExpires: Date
});

userSchema.pre('save', function() {
  if (this.panVatNumber) {
    this.role = 'gym-owner';
  } else {
    this.panVatNumber = undefined;
  }
});

userSchema.pre('save', async function(next) {
  //Only run this function if password is modified
  if (!this.isModified('password')) return next();

  //Hashing password
  this.password = await bcrypt.hash(this.password, 12);

  //delteing password confirm field while storing
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  //because saving in databse may take some time than issuing token so
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  //this refers to current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimpestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimpestamp < changedTimestamp; // 200 < 100
  }
  //False means password not changed
  return false;
};

userSchema.methods.createVerificationToken = function() {
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(emailVerificationToken)
    .digest('hex');

  this.emailverficationExpires = Date.now() + 10 * 60 * 1000;

  return emailVerificationToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
