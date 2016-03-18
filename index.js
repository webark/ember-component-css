/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var Concat = require('broccoli-concat');
var Merge = require('broccoli-merge-trees');
var WrappedStyles = require('./lib/pod-style.js');
var ExtractNames = require('./lib/pod-names.js');
var RemoveEmpty = require('./lib/remove-empty.js');

module.exports = {

  _getPodStyleFunnel() {
    return new Funnel('app', {
      srcDir: this._podDirectory(),
      exclude: ['styles/**/*'],
      include: this.allowedStyleExtentions.map(function(ext) { return new RegExp(ext + '$'); }),
      allowEmpty: true,
      annotation: 'Funnel (ember-component-css grab files)'
    });
  },

  _concatenatedPodStyles(wrappedStyles) {
    var concatenatedStyles = [];

    for (var i = 0; i < this.allowedStyleExtentions.length; i++) {
      var extension = this.allowedStyleExtentions[i];
      concatenatedStyles.push(new Concat(wrappedStyles, {
        outputFile: 'pod-styles.' + extension,
        inputFiles: ['**/*.' + extension],
        sourceMapConfig: { enabled: true },
        allowNone: true,
        annotation: 'Concat (ember-component-css pod-styles.' + extension + ')'
      }));
    }

    return new Merge(concatenatedStyles, {
      annotation: 'Merge (ember-component-css merge concatenated styles)'
    });
  },

  _allowedStyleExtentions() {
    return this.registry.extensionsForType('css');
  },

  _podDirectory() {
    return this.appConfig.podModulePrefix ? this.appConfig.podModulePrefix.replace(this.appConfig.modulePrefix, '') : '';
  },

  included(app) {
    this._super.included(app);
    this.appConfig = app.project.config(); 
    this.allowedStyleExtentions = this._allowedStyleExtentions();
  },

  treeForAddon(tree) {
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

  treeForStyles(tree) {
    var podStyles = this._getPodStyleFunnel();

    var wrappedStyles = new WrappedStyles(podStyles, {
      extensions: this.allowedStyleExtentions,
      annotation: 'Filter (ember-component-css wrap process :--component with class names)'
    });

    var concatStyles = this._concatenatedPodStyles(wrappedStyles);

    var removeEmptyFiles = new RemoveEmpty(concatStyles, {
      annotation: 'RemoveEmpty (ember-component-css remove empty files)'
    });

    return this._super.treeForStyles.call(this, removeEmptyFiles);
  },

  name: 'ember-component-css'
};
