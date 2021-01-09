const express = require('express');
const router = express.Router();

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

// @route DELETE api/stocks
// @desc Delete a stock
// @access Public
router.delete('/:id', (req, res) => {
  Stock.findById(req.params.id)
    .then(stock => stock.remove().then(() => res.json({success:true})))
    .catch(err => res.status(404).json({success:false}));
});

module.exports = router;
