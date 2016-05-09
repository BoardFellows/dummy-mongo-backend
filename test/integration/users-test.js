'use strict';

const mongoose = require('mongoose');
const User      = require(__dirname + '/../../backend/models/user.js');

const btoa = require('btoa');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const API_PORT = process.env.API_PORT || 8080;
const API_ADDRESS = `localhost:${API_PORT}`;

require(__dirname + '/../../backend/server.js');

describe('/users route', () => {
  // THIS IS THE USER THAT WILL BE POSTED AND RETRIEVED
  let newUser = {
    username: 'TESTUSER',
    password: '123abc',
    email:    'abc@abc.com'
  };
  let authToken = null;
  // MAKE SURE THE DATABASE IS CLEAN 
  before('Delete test user', (done) => {
    User.findOneAndRemove({ username: 'TESTUSER' }, (err) => {
      if (err) console.log('ERROR IN BEFORE BLOCK: ', err);
      done();
    });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  
  describe('POST', () => {
    it('should let you post a new user', (done) => {
      chai.request(API_ADDRESS)
      .post('/users')
      .send(newUser)
      .end((err, res) => {
        console.log(res.body);
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body.data.username).to.equal(newUser.username);
        expect(res.body.data.email).to.equal(newUser.email);
        expect(res.body.data).to.have.property('authToken');
        authToken = res.body.data.authToken;
        done();
      });
    });
    it('should have saved a new user in the database', (done) => {
      User.findOne({ username: newUser.username }, (err, user) => {
        console.log(user);
        if (err) console.log('ERROR getting new user from database to check against: ', err);
        expect(user.username).to.equal(newUser.username);
        expect(user.email).to.equal(newUser.email);
        expect(user.password).to.not.equal(newUser.password);
        done();
      });
    });
  });
  
  describe('GET', () => {
    var retrievedUser = null;
    // it('should not let you get a user if you fail to provide the correct information', (done) => {
    //   
    //   
    // });
    it('should give you back the user if you provide the correct information', (done) => {
      let authHeader = 'Basic ' + btoa(`${newUser.username}:${newUser.password}`);
      console.log('authHeader is ', authHeader);
      chai.request(API_ADDRESS)
        .get('/users')
        .set('authorization', authHeader)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body.data.username).to.equal(newUser.username);
          expect(res.body.data.email).to.equal(newUser.email);
          expect(res.body.data).to.have.property('authToken');
          done();
          
        });
      
      
    });
  //   it('should have provided data that is consistent with what is in the database', (done) => {
  //     
  //   });
  });
  
  
});
