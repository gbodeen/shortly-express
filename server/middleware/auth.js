var utils = require('../lib/hashUtils');

const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if ('cookies' in req && 'shortlyid' in req.cookies) { // has the session cookie
    assignExistingSession(req, res, next);
  } else { // doesn't have the session cookie
    initializeSession(req, res, next);
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

initializeSession = (req, res, next) => {
  models.Sessions.create()
    .then(insertionSuccess => {
      return models.Sessions.get({ 'id': insertionSuccess.insertId });
    })
    .then(newSession => {
      req.session = newSession;
      res.cookies = { shortlyid: { value: newSession.hash } };
      next();
    });
};

assignExistingSession = (req, res, next) => {
  models.Sessions.get({ 'hash': req.cookies.shortlyid })
    .then(matchingSession => {
      if (matchingSession) {
        req.session = matchingSession;
        next();
      } else {
        initializeSession(req, res, next);
      }
    });
};