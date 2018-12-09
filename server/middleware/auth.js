var utils = require('../lib/hashUtils');
const request = require('request');
const models = require('../models');
const Promise = require('bluebird');
const cookieParser = require('cookie-parser');
const partials = require('express-partials');
const bodyParser = require('body-parser');

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
      res.cookie('shortlyid', newSession.hash);
      return models.Users.get({ 'username': req.body.username })
        .then(matchingUser => {
          if (req.body.username === 'Vivian') {
            console.log('Vivian says Hi.   ', matchingUser);
          }

          if (matchingUser) {
            return models.Sessions.update({ 'id': newSession.id }, { 'userId': matchingUser.id });
            // .then(() => {
            //   models.Sessions.get({ 'id': newSession.id })
            //     .then(gottenSession => {
            //       console.log(gottenSession);
            //     });
            // })
          } else {
            return null;
          }
        });
    })
    .finally(() => next());
};

assignExistingSession = (req, res, next) => {
  models.Sessions.get({ 'hash': req.cookies.shortlyid })
    .then(matchingSession => {
      if (matchingSession) {
        req.session = matchingSession;
        res.cookie('shortlyid', matchingSession.hash);
        //res.cookie('shortlyid', JSON.stringify({ value: matchingSession.hash }));
        next();
      } else {
        initializeSession(req, res, next);
      }
    });
};