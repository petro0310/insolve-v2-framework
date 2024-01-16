const store = require('../classes/Store');
const events = require('../classes/EventEmitter');
const io = require('../classes/IO')();
const helpers = require('../exports/helpers');
// const config = require('../config');

const getEmojis = async () => {
  return await helpers.requestAPI('/emojis/all', {}, {method: 'GET', cache: true, cacheLife: 60 * 24});
}

const joinRoom = room => {
  store.set('lastJoinedRoom', room);
  io.construct('chat:joinRoom', room);
}

const sendMessage = (message, room) => {
  io.construct('chat:sendMessage', {room, content: message});
}

const deleteMessage = (data) => { // { steamid, content, time, room }
  io.construct('chat:deleteMessage', data);
}

module.exports = {
  emojisPrefix: 'https://emoji.gg/assets/emoji',
  
  getEmojis,
  sendMessage,
  deleteMessage,
  joinRoom
}