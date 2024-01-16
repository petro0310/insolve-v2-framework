const store = require('../classes/Store');
const events = require('../classes/EventEmitter');
const io = require('../classes/IO')();
const helpers = require('./helpers');
const config = require('../config');

const tf2_jackpot = {
  join: () => {
    io.construct('tf2_jackpot:joinSession', {});
  },

  leave: () => {
    io.construct('tf2_jackpot:leave', {});
  },

  requestValue: () => {
    io.construct('tf2_jackpot:getValue', {});
  },

  getPastGames: () => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/tf2_jackpot/pastGames`);

      resolve(res);
    });
  },

  getLeaderboard: () => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/leaderboard`);

      resolve(res);
    });
  }
}

module.exports = tf2_jackpot;