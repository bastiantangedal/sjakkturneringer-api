const express = require('express');
const monk = require('monk');
const joi = require('joi');
const Joi = require('joi');

const db = monk(process.env.MONGO_URI);
const tournaments = db.get('tournaments');

const schema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  place: Joi.string().trim().required(),
  date: Joi.string().trim().required(),
  organizer: Joi.string().trim().required(),
  arbitor: Joi.string().trim().required(),
  price: Joi.number(),
})

const router = express.Router();

// Get all tournaments (READ ALL)
router.get('/', (req, res, next) => {
  try {
    tournaments.find({}).then((data) => {
      res.json(data);
    })
  } catch (error) {
    next(error);
  }
});

// Create a tournament (CREATE ONE)
router.post('/:id', async (req, res, next) => {
  try {
    console.log(req.body);

    const value = await schema.validateAsync(req.body);
    const inserted = await tournaments.insert(value)

    res.json(inserted);
  } catch (error) {
    next(error);
  }
});

// Get specific tournament (READ ONE)
router.get('/:id', (req, res, next) => {
  res.json({
    message: 'Get a specific tournament',
  });
});

// Update specific tournament (UPDATE ONE)
router.put('/:id', (req, res, next) => {
  res.json({
    message: 'Update a specific tournament',
  });
});

// Delete specific tournament (DELETE ONE)
router.delete('/:id', (req, res, next) => {
  res.json({
    message: 'Delete a specific tournament',
  });
});

module.exports = router;
