const mongoose = require('mongoose');
const slugify = require('slugify');

const gymSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide gym name.'],
    trim: true,
    unique: true
  },
  summary: {
    type: String,
    trime: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide gym price.']
  },
  photo: String,
  gymLocation: {
    type: String,
    required: [true, 'Please provide gym location.']
  },
  ratingsAverage: Number,
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  slug: String
});

gymSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Gym = mongoose.model('Gym', gymSchema);

module.exports = Gym;
