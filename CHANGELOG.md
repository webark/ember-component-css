# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.6.7"></a>
## [0.6.7](https://github.com/ebryn/ember-component-css/compare/v0.6.5...v0.6.7) (2019-01-19)


### Bug Fixes

* **deprication:** updated to fix the outdated merge and use object.assign instead ([8b46279](https://github.com/ebryn/ember-component-css/commit/8b46279))
* **sass support:** latest sass now throws an eerro if semi colons are presnet, removing them from the style manifest. fixes issue [#301](https://github.com/ebryn/ember-component-css/issues/301) ([697e48c](https://github.com/ebryn/ember-component-css/commit/697e48c))



<a name="0.6.6"></a>
## [0.6.6](https://github.com/ebryn/ember-component-css/compare/v0.6.5...v0.6.6) (2019-01-19)


### Bug Fixes

* **deprication:** updated to fix the outdated merge and use object.assign instead ([8b46279](https://github.com/ebryn/ember-component-css/commit/8b46279))
* **sass support:** latest sass now throws an eerro if semi colons are presnet, removing them from the style manifest. fixes issue [#301](https://github.com/ebryn/ember-component-css/issues/301) ([697e48c](https://github.com/ebryn/ember-component-css/commit/697e48c))



<a name="0.6.5"></a>
## [0.6.5](https://github.com/ebryn/ember-component-css/compare/v0.6.4...v0.6.5) (2018-09-10)



<a name="0.6.4"></a>
## [0.6.4](https://github.com/ebryn/ember-component-css/compare/v0.6.3...v0.6.4) (2018-06-20)



<a name="0.6.3"></a>
## [0.6.3](https://github.com/ebryn/ember-component-css/compare/v0.6.2...v0.6.3) (2018-02-26)


### Bug Fixes

* **ember inspector:** Mixins created with an empty create breaks ember-inspector fixes [#275](https://github.com/ebryn/ember-component-css/issues/275) ([5533674](https://github.com/ebryn/ember-component-css/commit/5533674))



<a name="0.6.2"></a>
## [0.6.2](https://github.com/ebryn/ember-component-css/compare/v0.6.1...v0.6.2) (2018-02-06)


### Bug Fixes

* **module imports:** moved functionality that belonged to just the addon, over to the addon. fix [#259](https://github.com/ebryn/ember-component-css/issues/259) ([c016731](https://github.com/ebryn/ember-component-css/commit/c016731))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/ebryn/ember-component-css/compare/v0.6.0...v0.6.1) (2018-01-30)


### Bug Fixes

* **router:** accidentally removed a import super call in the routers didTransition. fixes [#266](https://github.com/ebryn/ember-component-css/issues/266) ([446a368](https://github.com/ebryn/ember-component-css/commit/446a368))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/ebryn/ember-component-css/compare/v0.5.0...v0.6.0) (2018-01-26)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/ebryn/ember-component-css/compare/v0.4.0...v0.5.0) (2017-11-17)


### Features

* **styleNamespace:** now upgrading to using 'styleNamespace' for the namespace computed property. Will offically deprecate componentCssClassName in the future ([#254](https://github.com/ebryn/ember-component-css/issues/254)) ([4bb72f9](https://github.com/ebryn/ember-component-css/commit/4bb72f9))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/ebryn/ember-component-css/compare/v0.3.7...v0.4.0) (2017-11-15)


### Features

* **route-namesapce:** Enable name-spacing of route styles ([114fe3b](https://github.com/ebryn/ember-component-css/commit/114fe3b))
* **route-namespace:** added documentation about an individual controllers styleNamespace property ([cb94979](https://github.com/ebryn/ember-component-css/commit/cb94979))



<a name="0.3.7"></a>
## [0.3.7](https://github.com/ebryn/ember-component-css/compare/v0.3.6...v0.3.7) (2017-11-02)


### Features

* **manifest ordering:** updated broccoli style manifest to now have the order of files in the manifest be sorted first by depth, then by alphanumeric ([fd710bf](https://github.com/ebryn/ember-component-css/commit/fd710bf))



<a name="0.3.6"></a>
## [0.3.6](https://github.com/ebryn/ember-component-css/compare/v0.3.5...v0.3.6) (2017-11-01)



<a name="0.3.5"></a>
## [0.3.5](https://github.com/ebryn/ember-component-css/compare/v0.3.4...v0.3.5) (2017-07-31)


### Bug Fixes

* **component name parsing:** only switching out the word 'component/' if it is what starts the path, not for nest options. This should be revisited with unification Closes [#236](https://github.com/ebryn/ember-component-css/issues/236) ([54e087e](https://github.com/ebryn/ember-component-css/commit/54e087e))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/ebryn/ember-component-css/compare/v0.3.3...v0.3.4) (2017-06-01)


### Bug Fixes

* **ensure environment:** getting the 'root host', and using a shim if the find host method isn't present, Closes [#231](https://github.com/ebryn/ember-component-css/issues/231) ([09fa5ec](https://github.com/ebryn/ember-component-css/commit/09fa5ec))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/ebryn/ember-component-css/compare/v0.3.2...v0.3.3) (2017-04-24)



<a name="0.3.2"></a>
## [0.3.2](https://github.com/ebryn/ember-component-css/compare/v0.3.1...v0.3.2) (2017-04-05)


### Bug Fixes

* **style manifest:** updated to new brocoli-style-mainifest properties that are more explicit ([5e848ca](https://github.com/ebryn/ember-component-css/commit/5e848ca))


### Features

* **optimization:** ability to use terse class names to reduce css size ([d53ead8](https://github.com/ebryn/ember-component-css/commit/d53ead8))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/ebryn/ember-component-css/compare/v0.3.0...v0.3.1) (2017-03-30)


### Bug Fixes

* **npm dependencies:** published what was being used to compile multiple differnt css preprocessors into one. closes [#221](https://github.com/ebryn/ember-component-css/issues/221) ([a060942](https://github.com/ebryn/ember-component-css/commit/a060942))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/ebryn/ember-component-css/compare/v0.2.12...v0.3.0) (2017-02-25)


### Features

* **extensible identifier:** moved the generation of the namespace identifier and if the class should be added to a mixin for easier extensibility ([e3c627b](https://github.com/ebryn/ember-component-css/commit/e3c627b))



<a name="0.2.12"></a>
## [0.2.12](https://github.com/ebryn/ember-component-css/compare/v0.2.11...v0.2.12) (2017-02-24)


### Bug Fixes

* **description:** removed pod specificity ([16eae3b](https://github.com/ebryn/ember-component-css/commit/16eae3b))
* **scss @ rules:** now allowing namespaceing of rules deinfed inside of a scss @ for rule. Fixes [#216](https://github.com/ebryn/ember-component-css/issues/216) ([6840c5e](https://github.com/ebryn/ember-component-css/commit/6840c5e))



<a name="0.2.11"></a>
## [0.2.11](https://github.com/ebryn/ember-component-css/compare/v0.2.10...v0.2.11) (2017-02-03)


### Bug Fixes

* **documentation:** updated for readabitlity ([d354534](https://github.com/ebryn/ember-component-css/commit/d354534))



<a name="0.2.10"></a>
## [0.2.10](https://github.com/ebryn/ember-component-css/compare/v0.2.9...v0.2.10) (2017-01-26)


### Bug Fixes

* **plain css:** Due to the odd nature of 'glob', you can't have a set of just one item. ([fd0d770](https://github.com/ebryn/ember-component-css/commit/fd0d770)), closes [#178](https://github.com/ebryn/ember-component-css/issues/178) [#204](https://github.com/ebryn/ember-component-css/issues/204)



<a name="0.2.9"></a>
## [0.2.9](https://github.com/ebryn/ember-component-css/compare/v0.2.8...v0.2.9) (2017-01-16)


### Bug Fixes

* **nested addons:** no longer switching to the parent app so that addon's specific settings can be used ([849a72d](https://github.com/ebryn/ember-component-css/commit/849a72d))



<a name="0.2.8"></a>
## [0.2.8](https://github.com/ebryn/ember-component-css/compare/v0.2.7...v0.2.8) (2016-12-14)



<a name="0.2.7"></a>
## [0.2.7](https://github.com/ebryn/ember-component-css/compare/v0.2.6...v0.2.7) (2016-12-01)


### Bug Fixes

* **namespacing:** no longer namespacing children of @ rules ([489f23f](https://github.com/ebryn/ember-component-css/commit/489f23f)), closes [#191](https://github.com/ebryn/ember-component-css/issues/191)



<a name="0.2.6"></a>
## [0.2.6](https://github.com/ebryn/ember-component-css/compare/v0.2.5...v0.2.6) (2016-12-01)


### Bug Fixes

* **ember-2.11:** moving to concatenating and reassigning the classnames in case a classname is already in the array before the init call per [@rwjblue](https://github.com/rwjblue) suggestion ([40113e6](https://github.com/ebryn/ember-component-css/commit/40113e6))



<a name="0.2.5"></a>
## [0.2.5](https://github.com/ebryn/ember-component-css/compare/v0.2.4...v0.2.5) (2016-12-01)


### Bug Fixes

* **ember-2.11:** now not pushing to the frozen classnames property, but reasigning it ([63274c0](https://github.com/ebryn/ember-component-css/commit/63274c0))



<a name="0.2.4"></a>
## [0.2.4](https://github.com/ebryn/ember-component-css/compare/v0.2.3...v0.2.4) (2016-11-22)



<a name="0.2.3"></a>
## [0.2.3](https://github.com/ebryn/ember-component-css/compare/v0.2.2...v0.2.3) (2016-11-15)



<a name="0.2.2"></a>
## [0.2.2](https://github.com/ebryn/ember-component-css/compare/v0.2.1...v0.2.2) (2016-11-05)
