var store = require('./store')

function xdstore(userConfig) {
  if (!userConfig.target) {
    console.warn('[xdstore] No target window found!')
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
        console.warn('[xdstore] origin mismatch', 'origin=', event.origin,  'expected(re)=', config.allowOrigin)
        return
      }
    } else {
      if (event.origin !== '*' && event.origin !== 'null' && event.origin !== config.allowOrigin) {
        console.warn('[xdstore] origin mismatch', 'origin=', event.origin,  'expected=', config.allowOrigin)
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
