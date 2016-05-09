'use strict';

const mongoose  = require('mongoose');

let roundSchema = new mongoose.Schema({
  date_created:   { type: Date, default: Date.now },
  date_modified:  { type: Date, default: Date.now },
  game:           { type: mongoose.Schema.ObjectId, ref: 'Game', required: true },
  num:            { type: Number, required: true },
  det1_loc:       { type: Number, default: null },
  det2_loc:       { type: Number, default: null },
  det3_loc:       { type: Number, default: null },
  det4_loc:       { type: Number, default: null },
  det5_loc:       { type: Number, default: null },
  mrx_loc:        { type: Number, default: null }
});

module.exports = mongoose.model('Round', roundSchema);
