/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var BrocComponentCssPreprocessor = require('./BrocComponentCssPreprocessor');

function ComponentCSSPreprocessor(options) {
  this.name = 'component-css';
  this.options = options || {};
}

ComponentCSSPreprocessor.prototype.toTree = function(tree, inputPath, outputPath) {
  var filteredTree = new Funnel(tree, {
    srcDir: this.options.podDir || 'app',
    exclude: [/^styles/]
  });

  return new BrocComponentCssPreprocessor(filteredTree);
};

module.exports = ComponentCSSPreprocessor;
