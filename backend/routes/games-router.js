'use strict';

const express       = require('express');

let gamesRouter     = express.Router();
let handleAuthToken = require(__dirname + '/../lib/authenticate').handleAuthToken;

gamesRouter.use(handleAuthToken);

gamesRouter.post('/', (req, res) => {
  console.log('POST request made to /games/');
  
  
  
});

gamesRouter.route('/:id')
  .get((req, res) => {
    console.log('GET request made to /games/:id');
    
    
  })
  .put((req, res) => {
    console.log('PUT request made to /games/:id');
    
    
    
  });
  
