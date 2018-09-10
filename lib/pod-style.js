/* eslint-env node */
'use strict';

var Filter = require('broccoli-persistent-filter');
var componentNames = require('./component-names.js');
var processStratagies = require('./preprocess-class-names');
var path = require('path');

module.exports = PodStyles;

PodStyles.prototype = Object.create(Filter.prototype);
PodStyles.prototype.constructor = PodStyles;
function PodStyles(inputTree, options) {
  options = options || {};
  Filter.call(this, inputTree, {
    annotation: options.annotation
  });
  this.extensions = options.extensions;
  this.classicStyleDir = options.classicStyleDir;
  this.terseClassNames = options.terseClassNames;
}

PodStyles.prototype.processString = function(contents, stylePath) {
  var extension = path.extname(stylePath),
      className = componentNames.class(stylePath, this.classicStyleDir, this.terseClassNames),
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
