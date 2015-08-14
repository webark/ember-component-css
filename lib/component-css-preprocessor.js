/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

var BrocComponentCssPreprocessor = require('./broc-component-css-preprocessor');

function ComponentCssPreprocessor(options) {
  this.name = 'component-css';
  this.options = options || {};
}

ComponentCssPreprocessor.prototype.toTree = function(tree, inputPath, outputPath) {
  var addon = this.options.addon;

  // Filter out just the stylesheets in pods
  var podStylesTree = new Funnel(tree, {
    srcDir: addon.podDir() || 'app',
    exclude: [/^styles/]
  });

  // Process the tree from above, outputs pod-styles and pod-lookup
  var processedTree = new BrocComponentCssPreprocessor(podStylesTree, { pod: addon.pod });

  // Move app/styles/app.css to dist/<app-name.css>
  var nonPodStyles = new Funnel(tree, {
    srcDir: inputPath,
    getDestinationPath: function(relativePath) {
      if (relativePath === 'app.css'){
        return outputPath + '/' + addon.app.name + '.css';
      } else {
        // all other files just remain the same
        return relativePath;
      }
    }
  });

  // both tree may contain same files
  tree = mergeTrees([tree, nonPodStyles], { overwrite: true } );

  // Merge the processed tree into the original tree to add the `styles` dir back in
  return mergeTrees([tree, processedTree]);
};

module.exports = ComponentCssPreprocessor;
