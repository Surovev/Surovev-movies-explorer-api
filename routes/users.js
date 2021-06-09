const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUserProfile,
  getUserInfo,

} = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);

module.exports = router;
