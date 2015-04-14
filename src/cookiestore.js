/**
 * Derivative work from store2.js
 *
 * Original copyright (c) 2013 ESHA Research
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
module.exports = function(document, store, options) {
  options = options || {}
  var _ = store._

  function create(name, items, update) {
    var length = 0
    for (var k in items) {
      if (items.hasOwnProperty(k)) {
        length++
      }
    }
    var area = _.inherit(_.storageAPI, { items:items, length:length, name:name })
    if (update) {
      addUpdateFn(area, 'setItem', update)
      addUpdateFn(area, 'removeItem', update)
    }
    return area
  }

  function addUpdateFn(area, name, update) {
    var old = area[name]
    area[name] = function() {
      var ret = old.apply(this, arguments)
      update.apply(this, arguments)
      return ret
    }
  }

  if (store.isFake() || options.forceCookie) {
    //console.log('fake env detected, using cookie fallback')
    var area,
      date = new Date(),
      key = 'xdstorelocal',
      items = {},
      cookies = document.cookie.split(';')
    date.setTime(date.getTime() + (30*24*60*60*1000))
    date = date.toGMTString()
    for (var i=0, m=cookies.length; i < m; i++) {
      var c = cookies[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(key) === 0) {
        items = JSON.parse(c.substring(key.length+1))
      }
    }

    area = create('cookie', items, function() {
      document.cookie = key+"="+JSON.stringify(this.items)+"; expires="+date+"; path=/"
    })

    store._area = _.areas.local = area
  }

  return store
}
