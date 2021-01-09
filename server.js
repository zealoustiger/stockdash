const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const stocks = require('./routes/api/stocks');
const app = express();

const cors = require("cors");
app.use(cors());
app.options('*', cors());

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose.connect(db)
  .then(() => console.log('Mongo Connected...'))
  .catch(err => console.log(err));

// Use Routes
app.use('/api/stocks', stocks)
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log('Server started on port ${port}'));
