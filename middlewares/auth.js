const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../utils/handlerToken');
require('dotenv').config();

const LoginError = require('../errors/LoginError');

// TODO: если нет токена и NODE_ENV !== 'production' нужно назначит токен по-умолчанию
// вынести код в отдельный модуль, т.к. испольуется в контроллере пользователя

module.exports = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    token = token.substring(7);
  }
  try {
    if (!token) {
      throw new LoginError('Необходима авторизация');
    }
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // записываем пейлоуд в объект запроса
    next(); // пропускаем запрос дальше
  } catch (err) {
    next(err);
  }
};
