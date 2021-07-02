const mongoose = require('mongoose');

// Опишем схему:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return /^(([^<>()\\[\]\\.,;:\s@\\"]+(\.[^<>()\\[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\]\\.,;:\s@\\"]+\.)+[^<>()[\]\\.,;:\s@\\"]{2,})$/i.test(v);
      },
      message: 'is not a valid email!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
