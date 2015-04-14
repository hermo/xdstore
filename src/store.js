var store = require('store2')

// Check that localStorage really works on the current browser
var localStorageWorks = (function() {
  // Safari / MobileSafari, by default, seem to block localStorage even
  // when used with an iframe from a different host so just give up and use
  // cookies instead.
  if (navigator.userAgent.indexOf('Safari') !== -1) {
    return false;
  }
  try {
    store.set('_sane', 1)
    if (store.get('_sane') === 1) {
      store.remove('_sane')
      return true

    } else {
      return false
    }
  } catch(e) {
    return false
  }
})()

var cook = require('./cookiestore.js')
store = cook(window.document, store, { forceCookie: !localStorageWorks, secure: true })

module.exports = store
