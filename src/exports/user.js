const store = require('../classes/Store');
const events = require('../classes/EventEmitter');
const io = require('../classes/IO')();
const helpers = require('./helpers');
const config = require('../config');

const user = {
  signIn: () => {
    helpers.popupCenter({url: `${config.url}/auth/steam`, title: 'Sign in', w: 800, h: 660});
  },

  signOut: (reload = false) => {
    store.delete('user', true);
    store.delete('token', true);

    events.emit('login', undefined);

    if(reload) window.location.reload();
  },

  _getConfig: () => {
    return config;
  },

  get: key => {
    const user = store.get('user') || {};

    return key ? user[key] : user;
  },

  /*updateLocalVal: (key, value) => {
    console.log(`updateLocalVal ${key}`, value);
    let user = store.get('user');
    user[key] = value;

    store.set('user', user);
  },*/

  signInWithSavedInfo: async (_token, cb) => {
    // todo: event listeners should be moved elsewhere
    events.on('user:updateValue-balance', balance => {
      store.set('user', {...store.get('user'), balance});
    });

    events.on('user:updateValue-xp', xp => {
      store.set('user', {...store.get('user'), xp});
    });

    events.on('user:updateValue-rank', rank => {
      store.set('user', {...store.get('user'), rank});
    });

    events.on('user:updateValue-banned', banned => {
      store.set('user', {...store.get('user'), banned});
    });

    events.on('user:updateValue-ban_reason', ban_reason => {
      store.set('user', {...store.get('user'), ban_reason});
    });

    events.on('user:updateValue-ban_expires_at_readable', ban_expires_at_readable => {
      store.set('user', {...store.get('user'), ban_expires_at_readable});
    });

    events.on('user:updateValue-ban_length', ban_length => {
      store.set('user', {...store.get('user'), ban_length});
    });

    events.on('user:updateValue-tradelink', tradelink => {
      store.set('user', {...store.get('user'), tradelink});
    });

    
    const user = store.get('user');
    const token = store.get('token') || _token;

    io.emit('handshake', token);

    console.log('user', user);
    console.log('token', token);
    console.log('_token', _token);

    
    if(!user && !token && !_token) return;

    console.log('go ahead');

    // send cached data to avoid the flash of sign-in button
    if(user) events.emit('login', user);

    // fetch actual data
    const res = await helpers.requestAPI(`/user/data/${token}`);
    
    if(res.user) {
      store.set('user', res.user);
      store.set('betaKeys', res.betaKeys);
      store.set('token', token);

      events.emit('login', res.user);

      // update ban status if it changed
      if(user) {
        if(!!user.banned !== !!res.user.banned) {
          events.emit('user:updateValue-banned', !!res.user.banned);
        }
      }

      // todo: temp fix for tradelink input
      events.emit('user:updateValue-tradelink', res.user.tradelink);

      if(cb && typeof cb == 'function') cb();
    } else {
      if(_token) {
        // alert(`Invalid token provided. Please refresh the page and try again.`);
        
        if(cb && typeof cb == 'function') cb();
      }
    }
  },

  loadSteamInventory: (appid = 730) => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/user/loadSteamInventory/${appid}`);

      if(res.inv) resolve(res.inv);
      else reject(res.msg);
    });
  },

  requestDeposit: (appid = 730, items = [], data) => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/user/requestDeposit/${appid}`, {items, data: data});

      if(res.id) resolve(res);
      else reject(res.msg);
    });
  },

  requestWithdraw: (appid = 730, items = {}) => {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/user/requestWithdraw/${appid}`, items);

      if(res.id) resolve(res);
      else reject(res.msg);
    });
  },

  updateTradelink(link) {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/user/updateTradelink`, {link});

      if(res.success) {
        store.set('user', {...store.get('user'), tradelink: link});
        resolve();
      }
      else reject(res.msg);
    });
  },

  getTransactions(type) {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/user/getTransactions`);

      if(res.success) resolve(res);
      else reject(res.msg);
    });
  },

  getStats() {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/user/stats`);

      if(res.success) resolve(res);
      else reject(res.msg);
    });
  },

  getAdminStats(week = 0) {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/admin/stats/${week}`);

      resolve(res);
    });
  },

  getAdminUsers(data) {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/admin/users`, data);

      resolve(res);
    });
  },

  clearAdminLogs() {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/admin/clearLogs`);

      resolve(res);
    });
  },

  getAdminPrices(r) {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(r ? '/admin/getPricesReview' : `/admin/getPrices`);

      resolve(res);
    });
  },

  withdrawAdminRake(botSteamid) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await helpers.requestAPI(`/rake/withdraw`, {
          bot: botSteamid
        });

        resolve(res);
      } catch(e) {
        reject(e);
      }
    });
  },

  getAdminRake() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await helpers.requestAPI(`/rake/info`);

        resolve(res);
      } catch(e) {
        reject(e);
      }
    });
  },

  loadLeaderboardWinners(filename) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await helpers.requestAPI(`/admin/lb/${filename}`);

        resolve(res);
      } catch(e) {
        reject(e);
      }
    });
  },

  restartServerAdmin() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await helpers.requestAPI(`/admin/restartServer`);

        resolve(res);
      } catch(e) {
        reject(e);
      }
    });
  },

  updateAdminPrice(sku, price, reset) {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/admin/updatePrice`, {sku, price, reset: !!reset});

      resolve(res);
    });
  },

  acceptPriceReviewAdmin(sku, accept = false) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await helpers.requestAPI(`/admin/acceptManualPrice`, {sku, accept});

        resolve(res);
      } catch(e) {
        reject(e);
      }
    });
  },

  resendOfferAdmin(offer) {
    return new Promise(async (resolve, reject) => {
      const res = await helpers.requestAPI(`/admin/resendOffer`, {offer});

      resolve(res);
    });
  },
}

module.exports = user;