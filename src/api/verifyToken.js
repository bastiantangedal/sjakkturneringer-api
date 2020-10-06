const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = function verifyAuth(req, res, next) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
  } catch (error) {
    next(error);
  }
};
