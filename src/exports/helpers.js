const store = require('../classes/Store');
const config = require('../config');

const helpers = {
  now: () => Math.round(new Date().getTime() / 1000),
  requestAPI: (endpoint, body = {}, options = {}) => {
    return new Promise(async (resolve, reject) => {
      const url = `${config.url}${endpoint}`;

      if(options.cache) {
        const cached = store.get(`_cache_${endpoint}`);

        if(cached) {
          const cached_time = parseInt( store.get(`_cache_${endpoint}_time`) );
          const now = helpers.now();
          const minutes_since_cache = Math.round((now - cached_time) / 60);

          if(minutes_since_cache >= parseInt(options.cacheLife)) store.delete(`_cache_${endpoint}`);
          else return resolve(cached);
          // console.log(`seconds since last cache: `, now - cached_time);
          // console.log(`minutes since last cache: `, Math.round((now - cached_time) / 60) );
          // console.log(`cache time: ${options.cacheLife}`);
        }
      }

      body.token = store.get('token');

      try {
        const res = await fetch(url, {
          method: options.method || 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: options.method == 'GET' ? undefined : JSON.stringify(body)
        });

        
        const data = await res.json();
        // if(res.status !== 200 || data.success === false) throw data.msg || data;  

        if(options.cache) {
          store.set(`_cache_${endpoint}`, data);
          store.set(`_cache_${endpoint}_time`, helpers.now());
        }
    
        resolve(data);
      } catch(e) {
        reject(e);
      }
    });
  },

  formatBalance: val => isNaN(val) ? '0.00' : parseFloat(val).toFixed(2),

  popupCenter: ({url, title, w, h}) => {
    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;
  
    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
  
    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop
    const newWindow = window.open(url, title, 
      `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `
    );
  
    if (window.focus) newWindow.focus();
  
    return newWindow;
  },

  sum: (arr, key) => arr.reduce((a, b) => +a + +b[key], 0)
}

module.exports = helpers;