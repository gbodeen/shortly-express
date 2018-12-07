const parseCookies = (req, res, next) => {
  if (req.headers.cookie) {
    req.cookies = (JSON.parse('{' + req.headers.cookie.split('; ').map(pair => {
      return '"' + pair.split('=').join('":"') + '"';
    }).join(',') + '}'));
  } else {
    req.cookies = {};
  }
  next();
};

module.exports = parseCookies;