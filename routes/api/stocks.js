// Tutorial is here: https://levelup.gitconnected.com/stocks-api-tutorial-with-javascript-40f24320128c

const express = require('express');
const router = express.Router();
const cors = require("cors");
const fetch = require("node-fetch");

require("dotenv").config();
const timePeriod = require("../../config/constants");

// Item Model
const Stock = require('../../models/Stock');

router.post("/", cors(), async (req, res) => {
  console.log("request body is ", req.body);
  const body = JSON.parse(JSON.stringify(req.body));
  const { ticker, type } = body;
  console.log("stocks-api.js 14 | body", body.ticker);

  const queryUrl = `https://www.alphavantage.co/query?function=${timePeriod(type)}&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
  console.log("queryUrl is: ", queryUrl);
  const request = await fetch(queryUrl);

  const data = await request.json();
  res.json({ data: data });
});

// @route GET api/stocks
// @desc Get all stocks
// @access Public
router.get('/', (req, res) => {
  Stock.find()
    .sort({date:-1})
    .then(stocks => res.json(stocks))
});

// @route POST api/stocks
// @desc Create a stock
// @access Public
// router.post('/', (req, res) => {
//   const newStock = new Stock({
//     name: req.body.name
//   });
//
//   newStock.save().then(stock => res.json(stock));
// });

// @route DELETE api/stocks
// @desc Delete a stock
// @access Public
router.delete('/:id', (req, res) => {
  Stock.findById(req.params.id)
    .then(stock => stock.remove().then(() => res.json({success:true})))
    .catch(err => res.status(404).json({success:false}));
});

module.exports = router;
