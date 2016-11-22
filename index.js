/* jshint node: true */
'use strict';
var Funnel = require('broccoli-funnel');
var Concat = require('broccoli-concat');
var Merge = require('broccoli-merge-trees');
var ProcessStyles = require('./lib/pod-style.js');
var ExtractNames = require('./lib/pod-names.js');
var IncludeAll = require('./lib/include-all.js');

module.exports = {

  _getPodStyleFunnel: function() {
    return new Funnel(this.projectRoot, {
      srcDir: this._podDirectory(),
      exclude: ['styles/**/*'],
      include: ['**/*.{' + this.allowedStyleExtensions + '}'],
      allowEmpty: true,
      annotation: 'Funnel (ember-component-css grab files)'
    });
  },

  _podDirectory: function() {
    return this.appConfig.podModulePrefix && !this._isAddon() ? this.appConfig.podModulePrefix.replace(this.appConfig.modulePrefix, '') : '';
  },

  _namespacingIsEnabled: function() {
    return this.addonConfig.namespacing !== false;
  },

  _isAddon: function() {
    return Boolean(this.parent.parent);
  },

  _allPodStyles: [],

  included: function(app) {
    if (app.app) { app = app.app; }

    this._super.included.apply(this, arguments);

    if (app.trees) {
      this.projectRoot = app.trees.app;
    }

    if (this._isAddon()) {
      this.parent.treeForMethods['addon-styles'] = 'treeForParentAddonStyles';
      this.parent.treeForParentAddonStyles = this.treeForParentAddonStyles.bind(this);
      this.projectRoot = this.parent.root + '/addon';
    }

    this.appConfig = app.project.config(app.env);
    this.addonConfig = this.appConfig['ember-component-css'] || {};
    this.allowedStyleExtensions = app.registry.extensionsForType('css').filter(Boolean);
  },

  treeForAddon: function(tree) {
    if (this._namespacingIsEnabled()) {
      var allPodStyles = new Merge(this._allPodStyles, {
        overwrite: true, // there are times (specifically with ember engines) where we run over the tree for twice. Should revist and find a way to prevent that in the future.
        annotation: 'Merge (ember-component-css merge all process styles for a complete list of styles)'
      });

      var podNames = new ExtractNames(allPodStyles, {
        annotation: 'Walk (ember-component-css extract class names from style paths)'
      });

      tree = new Merge([tree, podNames], {
        overwrite: true,
        annotation: 'Merge (ember-component-css merge names with addon tree)'
      });
    }

    return this._super.treeForAddon.call(this, tree);
  },

  treeForParentAddonStyles: function(tree) {
    return this.processComponentStyles(tree);
  },

  treeForStyles: function(tree) {
    if (!this._isAddon()) {
      tree = this.processComponentStyles(tree);
    }
    return this._super.treeForStyles.call(this, tree);
  },

  processComponentStyles: function(tree) {
    var podStyles = this._getPodStyleFunnel();
    this._allPodStyles.push(podStyles);

    if (this._namespacingIsEnabled()) {
      podStyles = new ProcessStyles(podStyles, {
        extensions: this.allowedStyleExtensions,
        annotation: 'Filter (ember-component-css process :--component with class names)'
      });
    }

    var styleManifest = new IncludeAll(podStyles, {
      annotation: 'IncludeAll (ember-component-css combining all style files that there are extensions for)'
    });

    tree = new Merge([podStyles, styleManifest, tree].filter(Boolean), {
      annotation: 'Merge (ember-component-css merge namespacedStyles with style manafest)'
    });

    return tree;
  },

  name: 'ember-component-css'
};
