/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

var BrocComponentCssPreprocessor = require('./broc-component-css-preprocessor');

function ComponentCssPreprocessor(options) {
  this.name = 'component-css';
  this.options = options || {};
}

ComponentCssPreprocessor.prototype.toTree = function(tree, inputPath) {
  var addon = this.options.addon;

  // Filter out just the stylesheets in pods
  var podStylesTree = new Funnel(tree, {
    srcDir: addon.podDir() || 'app',
    exclude: [/^styles/]
  });

  // Process the tree from above, outputs pod-styles and pod-lookup
  var processedTree = new BrocComponentCssPreprocessor(podStylesTree, { pod: addon.pod });

  // Looks weird, but essentially we funnel the files from 'app/styles'
  // to 'app/styles'. This way other preprocessors work fine, but we filter
  // out non-style files.
  var nonPodStylesTree = new Funnel(tree, {
    srcDir: inputPath,
    destDir: inputPath
  });   

  // Merge the processed tree into the original tree to add the `styles` dir back in
  return mergeTrees([nonPodStylesTree, processedTree]);
};

module.exports = ComponentCssPreprocessor;
