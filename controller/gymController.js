const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllGyms = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Gym.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const gym = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'sucess',
    results: gym.length,
    data: {
      gym
    }
  });
});

exports.getGym = catchAsync(async (req, res) => {
  const gym = await Gym.findById(req.params.id);

  res.status(200).json({
    status: 'sucess',
    data: {
      gym
    }
  });
});

exports.createGym = catchAsync(async (req, res) => {
  const newGym = await Gym.create({
    name: req.body.name,
    gymLocation: req.body.gymLocation,
    price: req.body.price,
    summary: req.body.summary,
    photo: req.body.photo
  });

  const token = req.cookies.jwt;
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  currentUser.gyms.push(newGym.id);
  // currentUser.numberGyms = currentUser.gyms.length;
  currentUser.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'sucess',
    data: {
      gym: newGym
    }
  });
});

exports.updateGym = catchAsync(async (req, res) => {
  const filteredBody = filterObj(
    req.body,
    'gymLocation',
    'price',
    'name',
    'summary'
  );
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedGym = await Gym.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  });
  updatedGym.slug = slugify(updatedGym.name, { lower: true });
  updatedGym.save();

  res.status(200).json({
    status: 'sucess',
    data: {
      gym: updatedGym
    }
  });
});

exports.deleteGym = catchAsync(async (req, res) => {
  await Gym.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'sucess',
    message: 'Gym deleted sucessfully'
  });
});

exports.getGymAdminDashboard = (req, res) => {
  res.status(200).render('gymadmin/base-admin', {
    title: 'Gymaholic | Gym Admin Dashboard'
  });
};

exports.getGyms = (req, res) => {
  res.status(200).render('gymadmin/getGyms', {
    title: 'Gymaholic | Gyms'
  });
};

exports.viewGym = catchAsync(async (req, res) => {
  const gym = await Gym.findOne({ slug: req.params.slug });

  res.status(200).render('gymadmin/viewGym', {
    title: 'Gymaholic | Gym Details',
    gym
  });
});

exports.editGym = catchAsync(async (req, res) => {
  const gym = await Gym.findOne({ slug: req.params.slug });

  res.status(200).render('gymadmin/editGym', {
    title: 'Gymaholic | Edit Gym',
    gym
  });
});

exports.getAddGym = (req, res) => {
  res.status(200).render('gymadmin/addGym', {
    title: 'Gymaholic | Add Gym'
  });
};
