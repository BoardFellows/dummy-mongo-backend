'use strict';

const mongoose = require('mongoose');

let gameSchema = new mongoose.Schema({
  host:           { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  player_1:       { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  player_2:       { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  winner:         { type: mongoose.Schema.ObjectId, ref: 'User' },
  rounds:         [{ type: mongoose.Schema.ObjectId, ref: 'Round' }],
  round_number:   { type: Number, default: 1 },
  date_created:   { type: Date, default: Date.now },
  date_modified:  { type: Date, default: Date.now },
  complete:       { type: Boolean, default: false }
});

module.exports = mongoose.model('Game', gameSchema);
