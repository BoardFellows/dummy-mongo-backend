'use strict';

const User        = require(__dirname + '/../models/user.js');
const jwt         = require('jsonwebtoken');
const authService = module.exports = {};

authService.handleBasicAuth = handleBasicAuth;
authService.handleAuthToken = handleAuthToken;
authService.handleAuthError = handleAuthError;


/**
* handleBasicAuth processes authorization basic headers
* it parses headers down to the text and attaches them to the request body
* @param {object} req
* @param {object} res
* @param {function} next
* 
*/
function handleBasicAuth(req, res, next) {
  console.log('authService.handleBasicAuth');
  try {
    if (!req.headers.authorization) {
      throw new Error('No authorization headers included with request.');
    }
    let authHeadersArray = req.headers.authorization.split(' ');
    if (authHeadersArray[0].toLowerCase() !== 'basic') {
      throw new Error(`Authorization headers of incorrect type: ${authHeadersArray[0]}`);
    }
    let decodedAuthHeaders = new Buffer(authHeadersArray[1], 'base64').toString();
    let usernamePasswordArray = decodedAuthHeaders.split(':');
    console.log(`Username was: ${usernamePasswordArray[0]}, password was: ${usernamePasswordArray[1]}`);
    User.findOne({ username: usernamePasswordArray[0] })
      .populate('friends').exec() //TODO: add game population
      .then((user) => {
        try {
          if (!user) {
            throw new Error('User not found.');
          }
          console.log(user);
          let validFlag = user.comparePassword(usernamePasswordArray[1]);
          if (!validFlag) {
            throw new Error('Incorrect password.');
          }
          // SUCCESSFUL REQUEST
          req.user      = user;
          req.authToken = user.generateAuthToken();
          next();
        } catch (err) {
          authService.handleAuthError(err, res);
        }
      })
      .catch((err) => {
        console.log('ERROR IN authService.handleBasicAuth: ', err);
        throw new Error(err);
      });
    
  } catch (err) {
    authService.handleAuthError(err, res);
  }
}



/**
* handleAuthToken determines whether an authorization token is valid
* if it is, it attaches the authenticating user onto the request body
* @param {object} req
* @param {object} res
* @param {function} next
* 
*/
function handleAuthToken(req, res, next) {
  console.log('authService.handleAuthToken');
  try {
    if (!req.headers.authorization) {
      throw new Error('No authorization headers included with request.');
    }
    let authHeadersArray = req.headers.authorization.split(' ');
    if (authHeadersArray[0].toLowerCase() !== 'token') {
      throw new Error(`Authorization headers of incorrect type: ${authHeadersArray[0]}`);
    }
    let decoded = jwt.verify(authHeadersArray[1], process.env.AUTH_TOKEN_SIGN_KEY || 'placeholder key');
    User.findOne({ _id: decoded._id }).exec()
      .then((user) => {
        // SUCCESSFUL REQUEST
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
    
    
  } catch (err) {
    console.log('ERROR IN authService.handleAuthToken: ', err);
    authService.handleAuthError(err, res);
  }
}


/**
* handleAuthError is called whenever an error occurs with authentication
* is called both for basic and token authentication routes
* it logs what the error was and sends a response indicating that their authentication failed
* @param {String} err
* @param {object} res
* 
*/
function handleAuthError(err, res) {
  console.log('authService.handleAuthError called, ERROR was: ', err);
  return res.status(400).json({ error: true, message: 'Authenication error.', data: null });
}
