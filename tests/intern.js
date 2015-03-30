define({
  proxyPort: 9000,
  proxyUrl: 'http://localhost:9000/',

  capabilities: {
    'selenium-version': '2.45.0'
  },

  environments: [
    { browserName: 'phantomjs' },
    { browserName: 'chrome' },
    { browserName: 'firefox' },
    //{ browserName: 'firefox', platform: [ 'Linux', 'OS X 10.10', 'Windows 7' ] },
    //{ browserName: 'internet explorer', version: '10', platform: 'Windows 8' },
    //{ browserName: 'internet explorer', version: '9', platform: 'Windows 7' },
    //{ browserName: 'internet explorer', version: '8', platform: 'Windows 7' },
    //{ browserName: 'safari', version: '6', platform: 'OS X 10.8' },
    //{ browserName: 'safari', version: '7', platform: 'OS X 10.9' }
    { browserName: 'safari', version: '8', platform: 'OS X 10.10' }
  ],

  maxConcurrency: 1,

  reporters: [ 'pretty' ],
  functionalSuites: [ 'tests/functional/xdstore' ],

  excludeInstrumentation: /^tests|node_modules\//
});
