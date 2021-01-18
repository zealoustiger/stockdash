// Tutorial is here: https://levelup.gitconnected.com/stocks-api-tutorial-with-javascript-40f24320128c

const express = require('express');
const router = express.Router();
const cors = require("cors");
const fetch = require("node-fetch");

require("dotenv").config();
const timePeriod = require("../../config/constants");

// Item Model
const Stock = require('../../models/Stock');

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
router.post('/', (req, res) => {
  const newStock = new Stock({
    name: req.body.name
  });

  newStock.save().then(stock => res.json(stock));
});

// @route POST api/stocks
// @desc Create a stock
// @access Public
router.post('/', (req, res) => {
  const newStock = new Stock({
    name: req.body.name
  });

  newStock.save().then(stock => res.json(stock));
});

// @route PUT api/stocks
// @desc Update a stock price
// @access Public
router.put('/alpha', (req, res) => {
  console.log('db updating:', req.body.ticker);
  Stock.findOne({name: req.body.ticker})
    .then(stock => {
      console.log('open prices', stock.open, req.body.open);
      stock.open = req.body.open;
      stock.update_date = Date.now();
      stock.save();
      res.json({success:true});
    })
    .catch(err => res.status(404).json({success:false}));
});

// @route DELETE api/stocks
// @desc Delete a stock
// @access Public
router.delete('/:id', (req, res) => {
  // console.log('db deleting:', req.params.id);
  Stock.findById(req.params.id)
    .then(stock => stock.remove().then(() => res.json({success:true})))
    .catch(err => res.status(404).json({success:false}));
});

// ROUTES for Alpha Vantage API
router.post("/alpha", cors(), async (req, res) => {
  const body = JSON.parse(JSON.stringify(req.body));
  const { ticker, type } = body;

  const queryUrl = `https://www.alphavantage.co/query?function=${timePeriod(type)}&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
  const request = await fetch(queryUrl);

  const data = await request.json();
  res.json({ data: data });
});

//unlimited stocks in 12 seconds X number of tickers (i.e 10 tickers = 120 seconds to get data.)
router.post("/alpha-unlimited", async (req, res) => {
  const body = JSON.parse(JSON.stringify(req.body));
  const { tickers, type } = body;

  let stocksArray = [];
  console.log("stocks-api.js 14 | body", body.tickers, tickers.length);
  await tickers.forEach(async (ticker, index) => {
    setTimeout(async () => {
      console.log("requesting:", ticker);
      const request = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
      );
      const data = await request.json();
      stocksArray.push(Object.values(data));
      if (stocksArray.length === tickers.length) {
        res.json({ tickers: stocksArray});
      }
    }, index * 12000);
  });
});

module.exports = router;
