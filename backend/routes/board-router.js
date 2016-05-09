'use strict';

const express   = require('express');
const board     = require(__dirname + '/../models/board.js');

let boardRouter = module.exports = express.Router();

boardRouter.get('/', (req, res) => {
  console.log('GET request made to /board');
  res.status(200).json({ error: false, message: null, data: board });
});
