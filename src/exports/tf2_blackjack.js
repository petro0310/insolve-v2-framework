const helpers = require('./helpers');

const tf2_blackjack = {
  sendTurn: (data) => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/tf2_blackjack/turn`, data);
      resolve(res);
    });
  },
  getLastTurn: (data) => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/tf2_blackjack/lastTurn`, data);
      resolve(res);
    });
  },

}

module.exports = tf2_blackjack;