const multer = require('multer');
const Jimp = require('jimp');
const AppError = require('./../utils/appError');

// uploading image in memeory buffer
const multerStorage = multer.memoryStorage();

// Allow to upload only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// Resize uploaded images
exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  Jimp.read(req.file.buffer, (err, img) => {
    img
      .resize(300, 300)
      .quality(90)
      .write(`public/img/users/${req.file.filename}`);
  });
  next();
};

exports.uploadUserPhoto = upload.single('photo');
exports.uploadGymPhoto = upload.single('photo');
