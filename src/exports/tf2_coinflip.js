const store = require('../classes/Store');
const events = require('../classes/EventEmitter');
const io = require('../classes/IO')();
const helpers = require('./helpers');
const config = require('../config');

const tf2_coinflip = {
  join: () => {
    io.construct('tf2_coinflip:joinSession', {});
  },

  leave: () => {
    io.construct('tf2_coinflip:leave', {});
  },

  requestValue: () => {
    io.construct('tf2_coinflip:getValue', {});
  },

  cancelGame: id => {
    io.construct('tf2_coinflip:cancelGame', {id});
  },

  getActiveGames: () => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/tf2_coinflip/active`);

      resolve(res);
    });
  },

  getPastGames: () => {
    return new Promise(async (resolve, reject) => {
        const res = await helpers.requestAPI(`/tf2_coinflip/past`);
        resolve(res);
    });
  },

  getAllGames: () => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/tf2_coinflip/all`);
      resolve(res);
    });
  },

  getGame: id => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await helpers.requestAPI(`/tf2_coinflip/game/${id}`);

        resolve(res);
      } catch(e) {
        reject(e);
      }
    });
  }
}

module.exports = tf2_coinflip;