/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const router = require('express').Router();
const Joi = require('joi');
const monk = require('monk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Connect to DB
const db = monk(process.env.MONGO_URI);
const userDatabase = db.get('users');
db.addMiddleware(require('monk-middleware-wrap-non-dollar-update'));
console.log('Auth is started');

const schema = Joi.object({
  _id: Joi.allow(),
  currentTournaments: Joi.array().allow(),
  name: Joi.string().required().min(10),
  username: Joi.string().required().min(5),
  password: Joi.string().required().min(5).max(1024),
});

const updateSchema = Joi.object({
  _id: Joi.allow(),
  currentTournaments: Joi.array().allow(),
  username: Joi.string().required().min(5),
  password: Joi.string().required().min(5).max(1024),
});

const loginSchema = Joi.object({
  username: Joi.string().required().min(5),
  password: Joi.string().required().min(5).max(1024),
});

router.post('/register', async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req.body);

    // Check if a user with the exact same name exists
    const userWithSameName = await userDatabase.findOne({
      name: value.name,
    });
    if (userWithSameName) return next('A user with that exact name already exists');

    // Check if a user with the same username exists
    const userWithSameUsername = await userDatabase.findOne({
      username: value.username,
    });
    if (userWithSameUsername) return next('A user with that username already exists');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.password, salt);

    // Change password to hashed password
    value.password = hashedPassword;

    const inserted = await userDatabase.insert(value);

    res.json(inserted);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);

    const user = await userDatabase.findOne({
      username: req.body.username,
    });
    if (user === null) return next('User not found');

    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);
      res.header('auth-token', token).send(token);
    } else {
      return next('Invalid password');
    }
  } catch (error) {
    next(error);
  }
});

router.put('/update', async (req, res, next) => {
  try {
  // Check if user exists
    const user = await userDatabase.findOne({
      username: req.body.username,
    });
    if (user === null) return next('User not found');

    const value = await updateSchema.validateAsync(req.body);
    const updatedUser = await userDatabase.findOneAndUpdate({ username: req.body.username }, value, { replaceOne: true });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// TODO: Delete user
// router.delete('/delete', async (req, res, next) => {
//   try {
//     const { password } = req.body;
//     await userDatabase.remove({ _id: id });
//     res.json({
//       message: `Tournament with id ${id} and name ${name} got deleted.`,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
