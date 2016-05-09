'use strict';

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser').json();
const mongoose    = require('mongoose');
const usersRouter = require(__dirname + '/routes/users-router.js');
// const gamesRouter = require(__dirname + '/routes/games-router.js');
// const boardRouter = require(__dirname + '/routes/board-router.js');
const API_PORT    = process.env.API_PORT || 8080;
const DB_PORT     = process.env.MONGO_URI || 'mongodb://localhost/db';
mongoose.connect(DB_PORT);
let connection = mongoose.connection;
connection.on('error', (err) => {
  console.log('ERROR CONNECTING TO MONGOOSE:', err);
});
connection.on('open', () => {
  app.use(bodyParser);
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });
  app.use('/users', usersRouter);
  // app.use('/games', gamesRouter);
  // app.use('/board', boardRouter);
  app.listen(API_PORT, () => {
    console.log(`API Listening on ${API_PORT}`);
  });
});
