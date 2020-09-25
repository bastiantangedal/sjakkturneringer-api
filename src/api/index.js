const express = require('express');

const emojis = require('./emojis');
const tournaments = require('./tournaments');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);
router.use('/tournaments', tournaments);

module.exports = router;
