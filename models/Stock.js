const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StockSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  open: {
    type: Number,
    default: 0
  },
  update_date: {
    type: Date,
    default: new Date - (1000*24*60*60*1000)
  }
});

module.exports = Stock = mongoose.model('stock', StockSchema);
