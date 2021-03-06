(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.xdstore = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! store2 - v2.5.9 - 2017-10-26
* Copyright (c) 2017 Nathan Bubna; Licensed (MIT OR GPL-3.0) */
;(function(window, define) {
    var _ = {
        version: "2.5.9",
        areas: {},
        apis: {},

        // utilities
        inherit: function(api, o) {
            for (var p in api) {
                if (!o.hasOwnProperty(p)) {
                    o[p] = api[p];
                }
            }
            return o;
        },
        stringify: function(d) {
            return d === undefined || typeof d === "function" ? d+'' : JSON.stringify(d);
        },
        parse: function(s) {
            // if it doesn't parse, return as is
            try{ return JSON.parse(s); }catch(e){ return s; }
        },

        // extension hooks
        fn: function(name, fn) {
            _.storeAPI[name] = fn;
            for (var api in _.apis) {
                _.apis[api][name] = fn;
            }
        },
        get: function(area, key){ return area.getItem(key); },
        set: function(area, key, string){ area.setItem(key, string); },
        remove: function(area, key){ area.removeItem(key); },
        key: function(area, i){ return area.key(i); },
        length: function(area){ return area.length; },
        clear: function(area){ area.clear(); },

        // core functions
        Store: function(id, area, namespace) {
            var store = _.inherit(_.storeAPI, function(key, data, overwrite) {
                if (arguments.length === 0){ return store.getAll(); }
                if (typeof data === "function"){ return store.transact(key, data, overwrite); }// fn=data, alt=overwrite
                if (data !== undefined){ return store.set(key, data, overwrite); }
                if (typeof key === "string" || typeof key === "number"){ return store.get(key); }
                if (!key){ return store.clear(); }
                return store.setAll(key, data);// overwrite=data, data=key
            });
            store._id = id;
            try {
                var testKey = '_safariPrivate_';
                area.setItem(testKey, 'sucks');
                store._area = area;
                area.removeItem(testKey);
            } catch (e) {}
            if (!store._area) {
                store._area = _.inherit(_.storageAPI, { items: {}, name: 'fake' });
            }
            store._ns = namespace || '';
            if (!_.areas[id]) {
                _.areas[id] = store._area;
            }
            if (!_.apis[store._ns+store._id]) {
                _.apis[store._ns+store._id] = store;
            }
            return store;
        },
        storeAPI: {
            // admin functions
            area: function(id, area) {
                var store = this[id];
                if (!store || !store.area) {
                    store = _.Store(id, area, this._ns);//new area-specific api in this namespace
                    if (!this[id]){ this[id] = store; }
                }
                return store;
            },
            namespace: function(namespace, noSession) {
                if (!namespace){
                    return this._ns ? this._ns.substring(0,this._ns.length-1) : '';
                }
                var ns = namespace, store = this[ns];
                if (!store || !store.namespace) {
                    store = _.Store(this._id, this._area, this._ns+ns+'.');//new namespaced api
                    if (!this[ns]){ this[ns] = store; }
                    if (!noSession){ store.area('session', _.areas.session); }
                }
                return store;
            },
            isFake: function(){ return this._area.name === 'fake'; },
            toString: function() {
                return 'store'+(this._ns?'.'+this.namespace():'')+'['+this._id+']';
            },

            // storage functions
            has: function(key) {
                if (this._area.has) {
                    return this._area.has(this._in(key));//extension hook
                }
                return !!(this._in(key) in this._area);
            },
            size: function(){ return this.keys().length; },
            each: function(fn, _and) {// _and is purely for internal use (see keys())
                for (var i=0, m=_.length(this._area); i<m; i++) {
                    var key = this._out(_.key(this._area, i));
                    if (key !== undefined) {
                        if (fn.call(this, key, _and || this.get(key)) === false) {
                            break;
                        }
                    }
                    if (m > _.length(this._area)) { m--; i--; }// in case of removeItem
                }
                return _and || this;
            },
            keys: function() {
                return this.each(function(k, list){ list.push(k); }, []);
            },
            get: function(key, alt) {
                var s = _.get(this._area, this._in(key));
                return s !== null ? _.parse(s) : alt || s;// support alt for easy default mgmt
            },
            getAll: function() {
                return this.each(function(k, all){ all[k] = this.get(k); }, {});
            },
            transact: function(key, fn, alt) {
                var val = this.get(key, alt),
                    ret = fn(val);
                this.set(key, ret === undefined ? val : ret);
                return this;
            },
            set: function(key, data, overwrite) {
                var d = this.get(key);
                if (d != null && overwrite === false) {
                    return data;
                }
                return _.set(this._area, this._in(key), _.stringify(data), overwrite) || d;
            },
            setAll: function(data, overwrite) {
                var changed, val;
                for (var key in data) {
                    val = data[key];
                    if (this.set(key, val, overwrite) !== val) {
                        changed = true;
                    }
                }
                return changed;
            },
            remove: function(key) {
                var d = this.get(key);
                _.remove(this._area, this._in(key));
                return d;
            },
            clear: function() {
                if (!this._ns) {
                    _.clear(this._area);
                } else {
                    this.each(function(k){ _.remove(this._area, this._in(k)); }, 1);
                }
                return this;
            },
            clearAll: function() {
                var area = this._area;
                for (var id in _.areas) {
                    if (_.areas.hasOwnProperty(id)) {
                        this._area = _.areas[id];
                        this.clear();
                    }
                }
                this._area = area;
                return this;
            },

            // internal use functions
            _in: function(k) {
                if (typeof k !== "string"){ k = _.stringify(k); }
                return this._ns ? this._ns + k : k;
            },
            _out: function(k) {
                return this._ns ?
                    k && k.indexOf(this._ns) === 0 ?
                        k.substring(this._ns.length) :
                        undefined : // so each() knows to skip it
                    k;
            }
        },// end _.storeAPI
        storageAPI: {
            length: 0,
            has: function(k){ return this.items.hasOwnProperty(k); },
            key: function(i) {
                var c = 0;
                for (var k in this.items){
                    if (this.has(k) && i === c++) {
                        return k;
                    }
                }
            },
            setItem: function(k, v) {
                if (!this.has(k)) {
                    this.length++;
                }
                this.items[k] = v;
            },
            removeItem: function(k) {
                if (this.has(k)) {
                    delete this.items[k];
                    this.length--;
                }
            },
            getItem: function(k){ return this.has(k) ? this.items[k] : null; },
            clear: function(){ for (var k in this.items){ this.removeItem(k); } },
            toString: function(){ return this.length+' items in '+this.name+'Storage'; }
        }// end _.storageAPI
    };

    var store =
        // safely set this up (throws error in IE10/32bit mode for local files)
        _.Store("local", (function(){try{ return localStorage; }catch(e){}})());
    store.local = store;// for completeness
    store._ = _;// for extenders and debuggers...
    // safely setup store.session (throws exception in FF for file:/// urls)
    store.area("session", (function(){try{ return sessionStorage; }catch(e){}})());

    if (typeof define === 'function' && define.amd !== undefined) {
        define('store2', [], function () {
            return store;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = store;
    } else {
        // expose the primary store fn to the global object and save conflicts
        if (window.store){ _.conflict = window.store; }
        window.store = store;
    }

})(this, this.define);

},{}],2:[function(require,module,exports){
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
      document.cookie = key+"="+JSON.stringify(this.items)+"; expires="+date+"; path=/" + (options.secure ? ';secure' : '')
    })

    store._area = _.areas.local = area
  }

  return store
}

},{}],3:[function(require,module,exports){
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

},{"./cookiestore.js":2,"store2":1}],4:[function(require,module,exports){
var store = require('./store')

function xdstore(userConfig) {
  if (!userConfig.target) {
    
    return { set: function(){}, get: function(){}, remove: function(){} }
  }

  var config = {
    target: userConfig.target,
    targetUrl: userConfig.targetUrl,
    onReady: userConfig.onReady || function(){},
    namespace: userConfig.namespace || 'xdstore',
    allowOrigin: userConfig.allowOrigin || '*',
    instance: Math.random().toString(36).substr(2, 9),
    messageId: 0
  }

  var methods = {
    _set_: function(options, callback) {
      store.set(options.key, options.value)
      callback(null)
    },
    _get_: function(options, callback) {
      callback(null, store.get(options.key))
    },
    _remove_: function(options, callback) {
      callback(null, store.remove(options.key))
    }
  }

  var callbacks = {}

  function nextMessageId() {
    return config.instance + '-' + (config.messageId+++1)
  }

  function sendMessage(name, data, id) {
    config.target.postMessage(JSON.stringify({
      namespace: config.namespace,
      id: id || nextMessageId(),
      name: name,
      data: data
    }), config.targetUrl)
  }


  function onMessage(event) {
    if (config.allowOrigin instanceof RegExp) {
      if (!event.origin.match(config.allowOrigin)) {
        
        return
      }
    } else {
      if (event.origin !== '*' && event.origin !== 'null' && event.origin !== config.allowOrigin) {
        
        return
      }
    }

    try {
      var request = JSON.parse(event.data)
    } catch(e)
    {
      return // No action, invalid json
    }

    if (request.namespace !== config.namespace) { return }

    if (request.name === '_init_') {
      if (request.data === 'PING') {
        sendMessage('_init_', 'PONG')
      }

      return config.onReady()
    }

    if (methods[request.name]) {
      methods[request.name](request.data, function(error, data) {
        sendMessage('_callback_' + request.name, {error: error, data: data}, request.id)
      })
    }

    if (callbacks[request.id]) {
      callbacks[request.id](request.data.error, request.data.data)
      delete callbacks[request.id]
    }
  }

  if (window.addEventListener) {
    window.addEventListener('message', onMessage, false)
  } else {
    window.attachEvent('onmessage', onMessage)
  }

  setTimeout(function() {
    sendMessage('_init_', 'PING')
  }, 0)

  return {
    set: function(key, value, callback) {
      var messageId = nextMessageId()

      if (callback) {
        callbacks[messageId] = callback
      }
      sendMessage('_set_', {key: key, value: value}, messageId)
    },
    get: function(key, callback) {
      var messageId = nextMessageId()

      if (callback) {
        callbacks[messageId] = callback
      }
      sendMessage('_get_', {key: key}, messageId)
    },
    remove: function(key, callback) {
      var messageId = nextMessageId()

      if (callback) {
        callbacks[messageId] = callback
      }
      sendMessage('_remove_', {key: key}, messageId)
    }
  }
}

module.exports = xdstore

},{"./store":3}]},{},[4])(4)
});