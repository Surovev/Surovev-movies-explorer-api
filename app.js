const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const {
  celebrate, Joi, errors,
} = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const LoginError = require('./errors/LoginError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use('/users', auth, require('./routes/users'));

app.use('/movies', auth, require('./routes/movies'));

app.use(() => {
  throw new LoginError('Недостаточно прав');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? `На сервере произошла ошибка: ${message}`
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  //  console.log(`App listening on port ${PORT}`);
});
