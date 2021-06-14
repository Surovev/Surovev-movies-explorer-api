const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUserProfile,
  getUserInfo,

} = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), updateUserProfile);

module.exports = router;
