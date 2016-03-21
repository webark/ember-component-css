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
    return new Funnel('app', {
      srcDir: this._podDirectory(),
      exclude: ['styles/**/*'],
      include: ['**/*.{' + this.allowedStyleExtentions + '}'],
      allowEmpty: true,
      annotation: 'Funnel (ember-component-css grab files)'
    });
  },

  _allowedStyleExtentions: function() {
    return this.registry.extensionsForType('css');
  },

  _podDirectory: function() {
    return this.appConfig.podModulePrefix ? this.appConfig.podModulePrefix.replace(this.appConfig.modulePrefix, '') : '';
  },

  included: function(app) {
    this._super.included.apply(this, arguments);
    this.appConfig = app.project.config(); 
    this.allowedStyleExtentions = this._allowedStyleExtentions();
  },

  treeForAddon: function(tree) {
    var podStyles = this._getPodStyleFunnel();
    var podNames = new ExtractNames(podStyles, {
      annotation: 'Walk (ember-component-css extract class names from style paths)'
    });

    var treeAndNames = new Merge([tree, podNames], {
      overwrite: true,
      annotation: 'Merge (ember-component-css merge names with addon tree)'
    });

    return this._super.treeForAddon.call(this, treeAndNames);
  },

  treeForStyles: function(tree) {
    var podStyles = this._getPodStyleFunnel();

    var processedStyles = new ProcessStyles(podStyles, {
      extensions: this.allowedStyleExtentions,
      annotation: 'Filter (ember-component-css process :--component with class names)'
    });

    var podStyles = new IncludeAll(processedStyles, {
      annotation: 'IncludeAll (ember-component-css combining all style files that there are extentions for)'
    });

    return this._super.treeForStyles.call(this, podStyles);
  },

  name: 'ember-component-css'
};
