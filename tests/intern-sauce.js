define({
  proxyPort: 9000,
  proxyUrl: 'http://localhost:9000/',

  capabilities: {
    'selenium-version': '2.45.0'
  },

  environments: [
    { browserName: 'chrome', platform: [ 'Linux', 'OS X 10.10', 'Windows 7' ] },
    { browserName: 'firefox', platform: [ 'Linux', 'OS X 10.10', 'Windows 7' ] },
    { browserName: 'internet explorer', version: ['8','9','10'] }
    //{ browserName: 'safari', version: '6', platform: 'OS X 10.8' },
    //{ browserName: 'safari', version: '7', platform: 'OS X 10.9' },
    //{ browserName: 'safari', version: '8', platform: 'OS X 10.10' }
  ],

  maxConcurrency: 3,
  tunnel: 'SauceLabsTunnel',

  reporters: [ 'pretty' ],
  functionalSuites: [ 'tests/functional/xdstore' ],

  excludeInstrumentation: /./
});
