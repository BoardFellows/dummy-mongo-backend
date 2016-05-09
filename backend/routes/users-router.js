'use strict';

const express         = require('express');
const User            = require(__dirname + '/../models/user.js');
const handleBasicAuth = require(__dirname + '/../lib/authenticate.js').handleBasicAuth;
let usersRouter = module.exports = express.Router();

usersRouter.route('/')
  .get(handleBasicAuth, (req, res) => {
    console.log('GET request made to /users');
    try {
      if (!req.authToken || !req.user) {
        throw new Error('authToken or user not found');
      }
      delete req.user.password;
      let responseData        = {};
      responseData.profile    = req.user;
      responseData.username   = req.user.username;
      responseData.email      = req.user.email;
      responseData.id         = req.user._id;
      responseData.authToken  = req.user.generateAuthToken();
      return res.status(200).json({ error: false, message: null, data: responseData });
    } catch (err) {
      console.log('ERROR in get to /users: ', err);
      return res.status(400).json({ error: true, message: 'There was an error loggin you in.', data: null });
    }
  })
  .post((req, res) => {
    console.log('POST request made to /users');
    try {
      if (!req.body.username || !req.body.password || !req.body.email) {
        throw new Error('Not enough information provided to create a user.');
      }
      let newUser = new User({
        username: req.body.username,
        email:    req.body.email,
        password: req.body.password
      });
      newUser.save((err, savedUser) => {
        if (err) throw new Error(err);
        delete savedUser.password;      
        let responseData        = {};
        responseData.profile    = savedUser;
        responseData.username   = savedUser.username;
        responseData.email      = savedUser.email;
        responseData.id         = savedUser._id;
        responseData.authToken  = savedUser.generateAuthToken();
        return res.status(200).json({ error: false, message: null, data: responseData });
      });
      
    // HANDLE ERRORS  
    } catch (err) {
      console.log('ERROR in post to /users: ', err);
      return res.status(400).json({ error: true, message: 'There was an error creating your account.', data: null });
      
    }
  });
