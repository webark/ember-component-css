/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var path = require('path');

var ComponentCSSPreprocessor = require('./ComponentCSSPreprocessor');
var ComponentCssPostprocessor = require('./ComponentCssPostprocessor');

function monkeyPatch(EmberApp) {
  var upstreamMergeTrees  = require('broccoli-merge-trees');
  var p     = require('ember-cli/lib/preprocessors');
  var preprocessCss = p.preprocessCss;

  function mergeTrees(inputTree, options) {
    var tree = upstreamMergeTrees(inputTree, options);

    tree.description = options && options.description;

    return tree;
  }

  EmberApp.prototype._filterAppTree = function() {
    if (this._cachedFilterAppTree) {
      return this._cachedFilterAppTree;
    }

    var excludePatterns = [].concat(
      this._podTemplatePatterns(),
      this._podStylePatterns(),
      [
        // note: do not use path.sep here Funnel uses
        // walk-sync which always joins with `/` (not path.sep)
        new RegExp('^styles/'),
        new RegExp('^templates/'),
      ]
    );

    return this._cachedFilterAppTree = new Funnel(this.trees.app, {
      exclude: excludePatterns,
      description: 'Funnel: Filtered App'
    });
  };

  EmberApp.prototype._podStylePatterns = function() {
    return this.registry.extensionsForType('css').map(function(extension) {
      return new RegExp(extension + '$');
    });
  };

  EmberApp.prototype.styles = function() {
    var addonTrees = this.addonTreesFor('styles');
    var external = this._processedExternalTree();
    var styles = new Funnel(this.trees.styles, {
      srcDir: '/',
      destDir: '/app/styles'
    });

    var podStyles = new Funnel(this.trees.app, {
      include: this._podStylePatterns(),
      exclude: [ /^styles/ ],
      destDir: '/app',
      description: 'Funnel: Pod Styles'
    });

    var trees = [external].concat(addonTrees, podStyles, styles);

    var stylesAndVendor = mergeTrees(trees, {
      description: 'TreeMerger (stylesAndVendor)'
    });

    var options = { outputPaths: this.options.outputPaths.app.css };
    options.registry = this.registry;
    var processedStyles = preprocessCss(stylesAndVendor, '/app/styles', '/assets', options);
    var vendorStyles    = this.concatFiles(stylesAndVendor, {
      inputFiles: this.vendorStaticStyles.concat(['vendor/addons.css']),
      outputFile: this.options.outputPaths.vendor.css,
      description: 'Concat: Vendor Styles'
    });

    if (this.options.minifyCSS.enabled === true) {
      options = this.options.minifyCSS.options || {};
      options.registry = this.registry;
      processedStyles = preprocessMinifyCss(processedStyles, options);
      vendorStyles    = preprocessMinifyCss(vendorStyles, options);
    }

    return mergeTrees([
        processedStyles,
        vendorStyles
      ], {
        description: 'styles'
      });
  };
}

module.exports = {
  name: 'ember-component-css',

  // Gets the path to the pods folder
  podDir: function() {
    var podModulePrefix = this.app.project.config().podModulePrefix;
    if (!podModulePrefix) { return 'app'; }
    var podPath = podModulePrefix.substr(podModulePrefix.indexOf('/') + 1);
    return path.join('app', podPath);
  },

  included: function(app) {
    monkeyPatch(app.constructor);
    this.app = app;
    var plugin = new ComponentCSSPreprocessor({ podDir: this.podDir() });
    this.app.registry.add('css', plugin);
  },

  postprocessTree: function(type, workingTree) {
    if (type === 'all') {
      return new ComponentCssPostprocessor(workingTree);
    }

    return workingTree;
  }
};
