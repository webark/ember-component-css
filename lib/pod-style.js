var Filter = require('broccoli-filter');
var componentNames = require('./component-names.js');

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
  return '.' + componentNames.class(path) + ' {' + string + '}';
};
