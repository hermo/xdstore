define([
  'intern!object',
  'intern/chai!assert',
  'require'
], function (registerSuite, assert, require) {

  var testValue

  registerSuite({
    name: 'xdstore',
    'the test loads': function () {
      return this.remote
      .get(require.toUrl('index.html'))
      .setFindTimeout(1000)
      .findByCssSelector('body.js-loaded')
      .findById('title')
      .getVisibleText()
      .then(function (text) {
        assert.strictEqual(text, 'xdstore test',
          'Page title should match');
      });
    },
    'it can store and access data via iframe': function() {
      testValue = "test" + Math.random()*1000
      return this.remote
      .get(require.toUrl('index.html'))
      .setFindTimeout(2000)
      .findByCssSelector('body.js-loaded')
      .findById('keyInput')
        .click()
        .type('test')
        .end()
      .findById('valInput')
        .click()
        .type(testValue)
        .end()
      .findById('setBtn')
        .click()
        .end()
      .findByCssSelector('#valInput.js-finished')
      .getProperty('value')
      .then(function(val) {
        assert.equal(val, '', 'The value input should be empty pressing set')
      });
    },
    'it can recall a previously saved value after a reload': function() {
      return this.remote
      .get(require.toUrl('index.html'))
      .setFindTimeout(1000)
      .findByCssSelector('body.js-loaded')
      .findById('keyInput')
        .click()
        .type('test')
        .end()
      .findById('valInput')
        .click()
        .type(testValue)
        .end()
      .findById('getBtn')
        .click()
        .end()
      .findByCssSelector('#valInput.js-finished')
      .getProperty('value')
      .then(function(val) {
        assert.equal(val, testValue, 'The value should be match the one previously stored')
      });
    }
  });
});
