var store = require('store2')

// Check that localStorage really works on the current browser
var localStorageWorks = (function() {
  var isPhantom = navigator.userAgent.indexOf('Phantom') !== -1
  var isChrome = navigator.userAgent.indexOf('Chrome') !== -1

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
store = cook(window.document, store, {
  forceCookie: !localStorageWorks,
  secure: location.protocol === 'https:' })

module.exports = store
