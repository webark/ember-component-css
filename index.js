/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var versionChecker = require('ember-cli-version-checker');
var path = require('path');
var fs = require('fs');

var ComponentCssPreprocessor = require('./lib/component-css-preprocessor');
var ComponentCssPostprocessor = require('./lib/component-css-postprocessor');

function monkeyPatch(EmberApp) {
  var upstreamMergeTrees = require('broccoli-merge-trees');
  var p = require('ember-cli/lib/preprocessors');
  var preprocessCss = p.preprocessCss;
  var preprocessMinifyCss = p.preprocessMinifyCss;

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
    if (fs.existsSync('app/styles/' + this.name + '.css')) {
      throw new SilentError('Style file cannot have the name of the application - ' + this.name);
    }

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
    var preprocessedStyles = preprocessCss(stylesAndVendor, '/app/styles', '/assets', options);

    var vendorStyles    = this.concatFiles(stylesAndVendor, {
      inputFiles: this.vendorStaticStyles.concat(['vendor/addons.css']),
      outputFile: this.options.outputPaths.vendor.css,
      description: 'Concat: Vendor Styles'
    });

    if (this.options.minifyCSS.enabled === true) {
      options = this.options.minifyCSS.options || {};
      options.registry = this.registry;
      preprocessedStyles = preprocessMinifyCss(preprocessedStyles, options);
      vendorStyles    = preprocessMinifyCss(vendorStyles, options);
    }

    var mergedTrees = mergeTrees([
        preprocessedStyles,
        vendorStyles
      ], {
        description: 'styles'
      });
    return this.addonPostprocessTree('css', mergedTrees);
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

  shouldSetupRegistryInIncluded: function() {
    return !versionChecker.isAbove(this, '0.2.0');
  },

  setupPreprocessorRegistry: function(type, registry) {
    registry.add('css', new ComponentCssPreprocessor({ addon: this }));
  },

  included: function(app) {
    monkeyPatch(app.constructor);

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }

    this.app = app;
    this.pod = {
      lookup: Object.create(null),
      styles: '',
      extension: ''
    };
  },

  postprocessTree: function(type, workingTree) {
    if (type === 'all') {
      return new ComponentCssPostprocessor(workingTree, { addon: this });
    }

    return workingTree;
  }
};
