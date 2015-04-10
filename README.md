# xdstore

[![Build Status](https://travis-ci.org/hermo/xdstore.svg?branch=master)](https://travis-ci.org/hermo/xdstore)

Cross-domain localStorage with a cookie-fallback for browsers.

Supported browsers:
  - Chrome 41+
  - Firefox 36+
  - IE8+

## Usage

Installation: `npm install xdstore`

See [index.html](index.html) and [tests/iframe.html](tests/iframe.html) for
a sample implementation.

## Testing

This project uses [Intern](https://theintern.github.io) for testing.

To run tests locally you need to have a working
[selenium](http://www.seleniumhq.org/) server running at 127.0.0.1:4444.

`npm test` runs the tests.

## Setup (Mac OS X) with Homebrew
A working [Homebrew](http://brew.sh/) installation is required.

Install `selenium-server-standalone`.

To run tests you also need to install `chromedriver` and `phantomjs`.

Run Selenium by running `selenium-server -p 4444`.


### Running tests using Sauce labs

Run `SAUCE_USERNAME=XXXX SAUCE_ACCESS_KEY=XXXX npm run test-sauce`.
You obviously need to have a saucelabs account to do this.

## Status

This project adheres to [Semantic Versioning](http://semver.org/).

As long as the version is pre-1.0 the API might still change drastically.

## Credits

- [nbubna/store](https://github.com/nbubna/store/) is used for localStorage and
  parts of the cookie fallback code.

## License

The MIT License (MIT).
