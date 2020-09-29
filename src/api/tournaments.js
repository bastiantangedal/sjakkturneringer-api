const express = require('express');
const monk = require('monk');
const Joi = require('joi');

const db = monk(process.env.MONGO_URI);
const tournaments = db.get('tournaments');

const schema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  place: Joi.string().trim().required(),
  group: Joi.string().trim().required(),
  date: Joi.string().trim().required(),
  organizer: Joi.string().trim().required(),
  time: Joi.string().trim().required(),
  arbiter: Joi.string().trim().required(),
  price: Joi.string().required(),
  players: Joi.array(),
});

const router = express.Router();

// Get all tournaments (READ ALL)
router.get('/', (req, res, next) => {
  try {
    tournaments.find({}).then((data) => {
      res.json(data);
    });
  } catch (error) {
    next(error);
  }
});

// Create a tournament (CREATE ONE)
router.post('/:id', async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req.body);
    const inserted = await tournaments.insert(value);

    res.json(inserted);
  } catch (error) {
    next(error);
  }
});

// Get specific tournament (READ ONE)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await tournaments.findOne({
      _id: id,
    });
    if (!item) return next();
    return res.json(item);
  } catch (error) {
    next(error);
  }
});

// Update specific tournament (UPDATE ONE)
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const value = await schema.validateAsync(req.body);
    const item = await tournaments.findOne({
      _id: id,
    });
    if (!item) return next();

    await tournaments.remove({ _id: id });
    const inserted = await tournaments.insert(value);

    res.json(inserted);
  } catch (error) {
    next(error);
  }
});

// Delete specific tournament (DELETE ONE)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id, name } = req.params;
    await tournaments.remove({ _id: id });
    res.json({
      message: `Tournament with id ${id} and name ${name} got deleted.`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
