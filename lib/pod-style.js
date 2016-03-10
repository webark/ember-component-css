var Filter = require('broccoli-persistent-filter');
var componentNames = require('./component-names.js');
var postcss = require('postcss');
var postcssSelectorNamespace = require('postcss-selector-namespace')

module.exports = PodStyles;

PodStyles.prototype = Object.create(Filter.prototype);
PodStyles.prototype.constructor = PodStyles;
function PodStyles(inputTree, options) {
  options = options || {};
  Filter.call(this, inputTree, {
    annotation: options.annotation
  });
  this.extensions = options.extensions;
}

PodStyles.prototype.processString = function(string, path) {
  return postcss()
          .use(postcssSelectorNamespace({
            selfSelector: /&|:--component/,
            namespace: '.' + componentNames.class(path),
            ignoreRoot: false
          }))
          .process(string)
          .css;
};
