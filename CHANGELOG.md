# Changelog

## [2.0.1](https://github.com/pleo-oss/s3-cache-action/compare/v2.0.0...v2.0.1) (2022-07-25)


### Bug Fixes

* Ensure consistent parameter naming ([#14](https://github.com/pleo-oss/s3-cache-action/issues/14)) ([b4a1774](https://github.com/pleo-oss/s3-cache-action/commit/b4a177420fa30238c4524b6d6e0d71870d660585))

## [2.0.0](https://github.com/pleo-oss/s3-cache-action/compare/v1.1.0...v2.0.0) (2022-07-25)


### ⚠ BREAKING CHANGES

* Makes AWS parameters required since ${{ env }} parameters aren't allowed for `default` definitions in `action.yml`.

### Features

* Fix AWS environment parameters not injecting as expected  ([#12](https://github.com/pleo-oss/s3-cache-action/issues/12)) ([25beab9](https://github.com/pleo-oss/s3-cache-action/commit/25beab95c6878c1f757338afe2ea11727fee6854))

## [1.1.0](https://github.com/pleo-oss/s3-cache-action/compare/v1.0.0...v1.1.0) (2022-07-25)


### Features

* Use AWS input parameters for region and secrets in AWS CLI invocation ([#11](https://github.com/pleo-oss/s3-cache-action/issues/11)) ([04568e4](https://github.com/pleo-oss/s3-cache-action/commit/04568e46e6e118dad59c319a1efedc9627fc7fda))
* Use SWC for fast test execution ([#9](https://github.com/pleo-oss/s3-cache-action/issues/9)) ([b774f44](https://github.com/pleo-oss/s3-cache-action/commit/b774f445b633244e86a583081f2c17c413c4390c))

## 1.0.0 (2022-07-21)


### Miscellaneous Chores

* release 1.0.0 ([97e86e4](https://github.com/pleo-oss/s3-cache-action/commit/97e86e43f45ed9c04d892fc70fd638f76bc11b45))
