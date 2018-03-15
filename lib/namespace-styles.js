'use strict';

var Filter = require('broccoli-persistent-filter');
var componentNames = require('./component-names.js');
var processStratagies = require('./preprocess-class-names');
var path = require('path');

module.exports = NamespaceStyles;

NamespaceStyles.prototype = Object.create(Filter.prototype);
NamespaceStyles.prototype.constructor = NamespaceStyles;
function NamespaceStyles(inputTree, options) {
  options = options || {};
  Filter.call(this, inputTree, {
    annotation: options.annotation
  });
  this.extensions = options.extensions;
  this.terseClassNames = options.terseClassNames;
}

NamespaceStyles.prototype.processString = function(contents, stylePath) {
  var extension = path.extname(stylePath),
      className = componentNames.class(stylePath, this.terseClassNames),
      strategy = 'default';

  switch (extension) {
    case '.styl':
    case '.sass':
      strategy = 'indentation';
      break;
    case '.less':
    case '.scss':
      strategy = 'syntax';
      break;
  }

  return processStratagies[strategy](contents, className, extension);
};
