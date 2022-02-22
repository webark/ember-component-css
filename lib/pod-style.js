/* eslint-env node */
'use strict';

var Filter = require('broccoli-persistent-filter');
var componentNames = require('./component-names.js');
var processStratagies = require('./preprocess-class-names');
var path = require('path');

class PodStyles extends Filter {
  constructor(inputTree, options) {
    super(inputTree, {
      annotation: options.annotation
    });
    this.extensions = options.extensions;
    this.classicStyleDir = options.classicStyleDir;
    this.terseClassNames = options.terseClassNames;
  }

  processString(contents, stylePath) {
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
  }
}

module.exports = PodStyles;
