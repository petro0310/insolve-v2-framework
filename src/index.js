const events = require('./classes/EventEmitter');
const store = require('./classes/Store');
const io = require('./classes/io')();

const user = require('./exports/user');
const chat = require('./exports/chat');
const steam = require('./exports/steam');
const helpers = require('./exports/helpers');
const roulette = require('./exports/roulette');
const tf2_jackpot = require('./exports/tf2_jackpot');
const tf2_coinflip = require('./exports/tf2_coinflip');
const tf2_mines = require('./exports/tf2_mines');

const config = require('./config');

console.log(`Powered by Insolve™ White Label Solution`, process.env.NODE_ENV == 'production' ? '' : '[Development]');

window.onload = async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  // auto login
  // user.signInWithSavedInfo();

  if(params['_ins_login']) {
    console.log('_ins_login', params['_ins_login']);

    if(window.opener) {
      window.opener.postMessage({action: '_ins_login_pm', token: params['_ins_login']});
      window.open('', '_self').close();
    } else {
      user.signInWithSavedInfo(params['_ins_login'], () => {
        window.location = '/';
      });
    }
  } else {
    user.signInWithSavedInfo();
  }
};

window.addEventListener("message", async e => {
  if(typeof e.data !== 'object') return;

  if(e.data && e.data.action == '_ins_login_pm') {
    user.signInWithSavedInfo(e.data.token);
  }
}, false);

const STATIC = {
  RANKS: ['User', 'Youtuber', 'Moderator', 'Admin', 'Owner']
}

window.insolve = {
  user,
  chat,
  helpers,
  events,
  store,
  steam,
  roulette,
  tf2_jackpot,
  tf2_coinflip,
  tf2_mines,
  io,
  STATIC,
  config
}