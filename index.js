/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var Concat = require('broccoli-concat');
var Merge = require('broccoli-merge-trees');
var WrappedStyles = require('./lib/pod-style.js');
var ExtractNames = require('./lib/pod-names.js');

module.exports = {
  name: 'ember-component-css',

  _getPodStyleFunnel() {
    return new Funnel('app', {
      srcDir: this._podDirectory(),
      exclude: ['styles/**/*'],
      include: this.allowedStyleExtentions.map(function(ext) { return new RegExp(ext + '$'); }),
      allowEmpty: true,
      annotation: 'Funnel (pod styles)'
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
        annotation: 'Concat (pod styles ' + extension + ')'
      }));
    }

    return new Merge(concatenatedStyles);
  },

  _allowedStyleExtentions() {
    return this.registry.extensionsForType('css').filter(function(extension) {
      return extension !== 'css' && extension !== 'sass';
    });
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
      annotation: 'Walk (extract pod style names from style files)'
    });

    var treeAndNames = new Merge([tree, podNames], {
      overwrite: true,
      annotation: 'Merge (pod style names with addon tree)'
    });

    return this._super.treeForAddon.call(this, treeAndNames);
  },

  treeForStyles(tree) {
    var podStyles = this._getPodStyleFunnel();

    var wrappedStyles = new WrappedStyles(podStyles, {
      extensions: this.allowedStyleExtentions,
      annotation: 'Filter (wrap pod styles with class names)'
    });

    var concatStyles = this._concatenatedPodStyles(wrappedStyles);

    return this._super.treeForStyles.call(this, concatStyles);
  },

};
