require('dotenv').config()
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

mongoose.connect('mongodb://user1:12345a@ds121494.mlab.com:21494/overflowaaaa');

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended:false }))

app.use('/',routes)

module.exports = app