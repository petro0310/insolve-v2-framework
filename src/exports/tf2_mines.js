const store = require('../classes/Store');
const events = require('../classes/EventEmitter');
const io = require('../classes/IO')();
const helpers = require('./helpers');
const config = require('../config');

const tf2_mines = {
  join: () => {
    io.construct('tf2_mines:joinSession', {});
  },

  leave: () => {
    io.construct('tf2_mines:leave', {});
  },

  requestValue: () => {
    io.construct('tf2_mines:getValue', {});
  },

  cancelGame: id => {
    io.construct('tf2_mines:cancelGame', {id});
  },

  pickMine: (gameId, mine) => {
    io.construct('tf2_mines:pickMine', {
      gameId,
      mine
    });
  },

  getActiveGames: () => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/tf2_mines/active`);

      resolve(res);
    });
  },

  getPastGames: () => {
    return new Promise(async (resolve, reject) => {
        const res = await helpers.requestAPI(`/tf2_mines/past`);
        resolve(res);
    });
  },

  getAllGames: () => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/tf2_mines/all`);
      resolve(res);
    });
  },

  getGame: id => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await helpers.requestAPI(`/tf2_mines/game/${id}`);

        resolve(res);
      } catch(e) {
        reject(e);
      }
    });
  }
}

module.exports = tf2_mines;