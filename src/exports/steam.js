const store = require('../classes/Store');
const events = require('../classes/EventEmitter');
const io = require('../classes/IO')();
const helpers = require('./helpers');
const config = require('../config');

const steam = {
  loadInventory: (appid = 730) => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/steam_bots/items/${appid}`);

      if(res.inv) resolve(res.inv);
      else reject(res.msg);
    });
  },
}

module.exports = steam;