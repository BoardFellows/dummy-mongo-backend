'use strict';

const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcrypt');
const mongoose  = require('mongoose');

let userSchema  = new mongoose.Schema({
  username:     { type: String, required: true, unique: true },
  email:        { type: String, required: true, unique: true },  
  password:     { type: String, required: true }, 
  // games:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  friends:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  date_created: { type: Date, default: Date.now }
});

// Automatically hashes a user's password for the prior to a save
userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  next();
});

userSchema.methods.comparePassword    = comparePassword;
userSchema.methods.generateAuthToken  = generateAuthToken;

module.exports = mongoose.model('User', userSchema);



/**
* comparePassword indicates whether a password matches what is stored in the database or not
* @param  {String}  inputPassword
* @return {Boolean} Boolean (true if passwords matched)
*/
function comparePassword(inputPassword) {
  return bcrypt.compareSync(inputPassword, this.password, bcrypt.genSaltSync(10));
}


/**
* generateAuthToken generates an authorization token to use with subsequent requests
* @return {String} authToken encodes the user's _id
* TODO: look into ways to make the authTokens expire after a while so that no single one can be used indefinitely
*/
function generateAuthToken() {
  return jwt.sign({ _id: this._id }, process.env.AUTH_TOKEN_SIGN_KEY || 'placeholder key');
}
