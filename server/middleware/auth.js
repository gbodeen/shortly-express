var utils = require('../lib/hashUtils');

const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (req.session) {
    console.log('WE HIT THIS BRANCH \n \n');
  } else if (req.cookies.shortlyid) {
    console.log('req.cookies.shortlyid      : ', req.cookies.shortlyid);
    return models.Sessions.get({ 'hash': req.cookies.shortlyid })
      .then(getSession => {
        req.session = getSession;
        req.session.userId = getSession.userId;
        return models.Users.get({ 'id': getSession.userId });
      })
      .then(getUser => {
        //console.log('%%%%%%%%%%: getUser:  ', getUser);
        req.session.user = { username: getUser ? getUser.username : 'ANONYMOUS' };
      })
      .finally(() => {
        next();
      });
  } else {
    models.Sessions.create()
      .then(createResult => {
        return models.Sessions.get({ 'id': createResult.insertId });
      })
      .then(getSession => {
        req.session = getSession;
        res.cookies.shortlyid = { value: getSession.hash };
      })
      .finally(() => {
        next();
      });
  }
};
/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

