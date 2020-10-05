const express = require('express');

const emojis = require('./emojis');
const tournaments = require('./tournaments');
const auth = require('./auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);
router.use('/tournaments', tournaments);
router.use('/user', auth);

module.exports = router;
