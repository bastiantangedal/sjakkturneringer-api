const express = require('express');
const monk = require('monk');

const db = monk(process.env.MONGO_URI);
const tournaments = db.get('tournaments');

const router = express.Router();

// Get all tournaments (READ ALL)
router.get('/', (req, res, next) => {
  try {
    const allTournaments = tournaments.find({});
    res.json(allTournaments);
  } catch (error) {
    next(error);
  }
});

// Create a tournament (CREATE ONE)
router.post('/:id', (req, res, next) => {
  res.json({
    action: 'Create a tournament',
    response: req.body,
  });
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
