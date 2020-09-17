# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.7] - 2020-09-17

### Fixed

- Handle unexpected crash error during Unity build

## [1.2.6] - 2020-04-24

### Fixed

- Fixed custom unity editor path mode specifier ID

## [1.2.5] - 2020-04-21

### Added

- Added timestamp for filename utility

## [1.2.4] - 2020-04-21

### Changed

- Now using `setTimeout` instead of `Atomics.wait` for sleep

## [1.2.3] - 2020-04-21

### Changed

- Updated `@types/node` dependency

## [1.2.2] - 2020-04-21

### Changed

- Removed path mode enum and using plain string instead

## [1.2.1] - 2020-04-21

### Fixed

- Fix path tools not exported

## [1.2.0] - 2020-04-21

### Added

- Added path tools to generate paths to Unity executables

## [1.1.0] - 2020-04-18

### Added

- Added Unity tool runner utility
- Added Unity log streamer utility

## [1.0.0] - 2020-04-18

Initial release