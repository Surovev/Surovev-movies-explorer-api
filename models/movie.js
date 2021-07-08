const mongoose = require('mongoose');

// Опишем схему:
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    validate: {
      validator (v) {
        return /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\\/])*)?/.test(v);
      },
      message: 'is not a valid url!'
    },
    required: true
  },
  trailer: {
    type: String,
    validate: {
      validator (v) {
        return /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\\/])*)?/.test(v);
      },
      message: 'is not a valid url!'
    },
    required: true
  },
  thumbnail: {
    type: String,
    validate: {
      validator (v) {
        return /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\\/])*)?/.test(v);
      },
      message: 'is not a valid url!'
    },
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  nameRU: {
    type: String,
    required: true
  },
  nameEN: {
    type: String,
    required: true
  }
});

// создаём модель и экспортируем её
module.exports = mongoose.model('movie', movieSchema);
