const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const LoginError = require('../errors/LoginError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const JWT_SECRET = require('../utils/handlerToken');

const SOLT_ROUNDS = 10;

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new LoginError('Неправильная почта или пароль');
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new LoginError('Неправильная почта или пароль');
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new LoginError('Неправильная почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET);
          res.cookie('userToken', token, {
            maxAge: 360000 * 7 * 24,
            httpOnly: true,
            sameSite: true,
          })
            .send({
              _id: user._id,
              token,
            });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({ data: user });
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;
  bcrypt.hash(req.body.password, SOLT_ROUNDS)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      if (!user.name) {
        throw new ValidationError('Введены некоректные данные');
      }
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError') {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch((err) => next(err));
};
