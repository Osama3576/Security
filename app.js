//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const exp = require('constants');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
//////////////////////////////////////////////////Mongose setup
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/usersDB', err => {
  if (err) {
    console.log(`unable to connect to thse server: ${err}`);
  } else {
    console.log(`mongodb is connected`);
  }
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password'],
});
const userModel = new mongoose.model('User', userSchema);

////////////////////////////////////////////////Pages to rendr
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/register', (req, res) => {
  res.render('register');
});
////
app.post('/register', (req, res) => {
  const email = req.body.username;
  const pass = req.body.password;
  const newUser = new userModel({
    email: email,
    password: pass,
  });
  newUser.save(err => {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});
////
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  userModel.findOne({ email: username }, (err, founduser) => {
    if (err) {
      console.log(err);
    } else {
      if (founduser) {
        if (founduser.password === password) {
          res.render('secrets');
        }
      }
    }
  });
});
///////////////////////////////////////////
app.listen(3000, function () {
  console.log('Server started on port 3000');
});
