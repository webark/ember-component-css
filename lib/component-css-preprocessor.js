/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

var BrocComponentCssPreprocessor = require('./broc-component-css-preprocessor');

function ComponentCssPreprocessor(options) {
  this.name = 'component-css';
  this.options = options || {};
}

ComponentCssPreprocessor.prototype.toTree = function(tree) {
  var addon = this.options.addon;

  // Filter out just the stylesheets in pods
  var filteredTree = new Funnel(tree, {
    srcDir: addon.podDir() || 'app',
    exclude: [/^styles/]
  });

  // Process the tree from above, outputs pod-styles and pod-lookup
  var processedTree = new BrocComponentCssPreprocessor(filteredTree, { pod: addon.pod });

  // Merge the processed tree into the original tree to add the `styles` dir back in
  return mergeTrees([tree, processedTree]);
};

module.exports = ComponentCssPreprocessor;
