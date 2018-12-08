var cookie = require('cookie');

const parseCookies = (req, res, next) => {
  if (req.headers.cookie) {
    req.cookies = cookie.parse(req.headers.cookie);
  }
  next();
};

module.exports = parseCookies;