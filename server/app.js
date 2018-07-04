require('dotenv').config()
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/overflowthing');

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended:false }))

app.use('/',routes)

app.listen(3000,console.log("you're listening...right?"))