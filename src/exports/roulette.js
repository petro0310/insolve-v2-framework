const store = require('../classes/Store');
const events = require('../classes/EventEmitter');
const io = require('../classes/IO')();
const helpers = require('./helpers');
const config = require('../config');

const roulette = {
  placeBet: (amount, color) => {
    io.construct('roulette:placeBet', {color, amount});
  },

  join: () => {
    io.construct('roulette:joinSession', {});
  },

  leave: () => {
    io.construct('roulette:leave', {});
  }
}

module.exports = roulette;