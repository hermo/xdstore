# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.8.0] - 2017-11-25
### Changed
- Removed Safari localStorage fallback by default

## [0.7.3] - 2015-04-14
### Added
- Use secure cookie fallback when served via HTTPS

### Fixed
- Improve Safari detection to not match Chrome too
- Detect PhantomJS separately from Chrome and Safari

## [0.7.2] - 2015-04-14
### Fixed
- Remove console.log references

## [0.7.1] - 2015-04-14
### Changed
- Always use cookie fallback with Safari as it seems to block localStorage
  when used from an iframe in another host.

## [0.7.0] - 2015-03-31
### Added
- IE8 support
- Functional tests for
  Chrome 41+ & Firefox 36+ (Windows 7, OS X 10.10, Linux), IE8, IE9, IE10
- Travis CI integration
- A [README](README.md)

## [0.6.0] - 2015-03-25
### Added
- Expose internal store api. Usage: ```require('xdstore/store')```

## 0.5.0 - 2015-03-24
### Added
- This changelog
- Cookie fallback when localStorage is unusable

[unreleased]: https://github.com/hermo/xdstore/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/hermo/xdstore/compare/v0.5.0...v0.6.0
[0.7.0]: https://github.com/hermo/xdstore/compare/v0.6.0...v0.7.0
[0.7.1]: https://github.com/hermo/xdstore/compare/v0.7.0...v0.7.1
[0.7.2]: https://github.com/hermo/xdstore/compare/v0.7.1...v0.7.2
[0.7.3]: https://github.com/hermo/xdstore/compare/v0.7.2...v0.7.3
