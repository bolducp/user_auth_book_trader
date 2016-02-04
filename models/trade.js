'use strict';

var mongoose = require('mongoose');

var tradeSchema = new mongoose.Schema({
  offeredBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  desiredBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  offeringUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receivingUser:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {type: String, default: "pending"}
});

var Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
