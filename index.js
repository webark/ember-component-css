'use strict';

var Funnel = require('broccoli-funnel');
var Merge = require('broccoli-merge-trees');
var ProcessStyles = require('./lib/pod-style.js');
var ExtractNames = require('./lib/pod-names.js');
var StyleManifest = require('broccoli-style-manifest');
var Replace = require('broccoli-replace');
let VersionChecker = require("ember-cli-version-checker");

module.exports = {

  _getStyleFunnel: function() {
    return new Merge([this._getPodStyleFunnel(), this._getClassicStyleFunnel()], {
      annotation: 'Merge (ember-component-css merge pod and classic styles)'
    });
  },

  _getPodStyleFunnel: function() {
    return new Funnel(this.projectRoot, {
      srcDir: this._podDirectory(),
      exclude: ['styles/**/*'],
      include: ['**/*.{' + this.allowedStyleExtensions + ',}'],
      allowEmpty: true,
      annotation: 'Funnel (ember-component-css grab files)'
    });
  },

  _getClassicStyleFunnel: function() {
    return new Funnel(this.projectRoot, {
      include: ['styles/' + this.classicStyleDir + '/**/*.{' + this.allowedStyleExtensions + ',}'],
      allowEmpty: true,
      annotation: 'Funnel (ember-component-css grab classic files)'
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

  _projectRoot: function(trees) {
    var projectRoot;
    if (this._isAddon()) {
      projectRoot = this.parent.root + '/addon';
    } else if (trees && trees.app) {
      projectRoot = trees.app;
    } else {
      projectRoot = this.parent.root + '/app';
    }

    return projectRoot;
  },

  _getEnvironment: function() {
    if (!this._findHost) {
      this._findHost = function findHostShim() {
        let current = this;
        let app;
        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };
    }

    return this._findHost().env;
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    this.projectRoot = this._projectRoot(app.trees);

    if (this._isAddon()) {
      this.parent.treeForMethods['addon-styles'] = 'treeForParentAddonStyles';
      this.parent.treeForParentAddonStyles = this.treeForParentAddonStyles.bind(this);
    }

    this.appConfig = app.project.config(this._getEnvironment());
    this.addonConfig = this.appConfig['ember-component-css'] || {};
    this.classicStyleDir = this.addonConfig.classicStyleDir || 'component-styles';
    this.terseClassNames = Boolean(this.addonConfig.terseClassNames);
    this.allowedStyleExtensions = app.registry.extensionsForType('css').filter(Boolean);
  },

  config: function(enviroment) {
    var config = {
      "ember-component-css": {
        terseClassNames: false,
      },
    };
    if (enviroment === 'production') {
      config["ember-component-css"].terseClassNames = true;
    }
    return config;
  },

  treeForAddon: function(tree) {
    if (this._namespacingIsEnabled()) {
      var allPodStyles = new Merge(this._allPodStyles, {
        overwrite: true, // there are times (specifically with ember engines) where we run over the tree for twice. Should revist and find a way to prevent that in the future.
        annotation: 'Merge (ember-component-css merge all process styles for a complete list of styles)'
      });

      var podNames = new ExtractNames(allPodStyles, {
        classicStyleDir: this.classicStyleDir,
        terseClassNames: this.terseClassNames,
        annotation: 'Walk (ember-component-css extract class names from style paths)'
      });

      tree = new Merge([tree, podNames], {
        overwrite: true,
        annotation: 'Merge (ember-component-css merge names with addon tree)'
      });
    }
    let checker = new VersionChecker(this);
    let ember = checker.forEmber();
    let superTree = this._super.treeForAddon.call(this, tree);
    if (ember.isAbove('3.6.0')) {
      return new Funnel(superTree, {
        exclude: ['ember-component-css/initializers/route-styles.js'],
        annotation:
          "Funnel (ember-component-css exclude addon/initializers/route-styles.js in 3.6+)"
      });
    } else {
      return new Funnel(superTree, {
        exclude: ["ember-component-css/instance-initializers/route-styles.js"],
        annotation:
          "Funnel (ember-component-css exclude addon/instance-initializers/route-styles.js in < 3.6)"
      });
    }
  },

  treeForApp: function(tree) {
    let checker = new VersionChecker(this);
    let ember = checker.forEmber();
    if (ember.isAbove('3.6.0')) {
      return new Funnel(tree, {
        exclude: ["initializers/route-styles.js"],
        annotation:
          "Funnel (ember-component-css exclude app/initializers/route-styles.js in 3.6+)"
      });
    } else {
      return new Funnel(tree, {
        exclude: ["instance-initializers/route-styles.js"],
        annotation:
          "Funnel (ember-component-css exclude app/instance-initializers/route-styles.js in < 3.6)"
      });
    }
  },

  treeForParentAddonStyles: function(tree) {
    let defaultTree = tree;

    if (this.parent.treeForAddonStyles) {
      defaultTree = this.parent.treeForAddonStyles.apply(this.parent, arguments);
    }

    return this.processComponentStyles(defaultTree);
  },

  treeForStyles: function(tree) {
    if (!this._isAddon()) {
      tree = this.processComponentStyles(tree);
    }
    return this._super.treeForStyles.call(this, tree);
  },

  processComponentStyles: function(tree) {
    var podStyles = this._getStyleFunnel();
    this._allPodStyles.push(podStyles);

    if (this._namespacingIsEnabled()) {
      podStyles = new ProcessStyles(podStyles, {
        extensions: this.allowedStyleExtensions,
        classicStyleDir: this.classicStyleDir,
        terseClassNames: this.terseClassNames,
        annotation: 'Filter (ember-component-css process :--component with class names)'
      });
    }

    var podStylesWithoutExcluded = new Funnel(podStyles, {
      exclude: this.addonConfig.excludeFromManifest || [],
      annotation: 'Funnel (ember-component-css exclude style files from manifest)'
    });

    var styleManifest = new StyleManifest(podStylesWithoutExcluded, {
      outputFileNameWithoutExtension: 'pod-styles',
      annotation: 'StyleManifest (ember-component-css combining all style files that there are extensions for)'
    });

    // this is due to sass spcifically not allowing for ANY semicolons.
    styleManifest = new Replace(styleManifest, {
      files: ['**/*.sass'],
      patterns: [{
        match: /;/g,
        replacement: '',
      }],
    });

    tree = new Merge([podStyles, styleManifest, tree].filter(Boolean), {
      annotation: 'Merge (ember-component-css merge namespacedStyles with style manafest)'
    });

    return tree;
  },

  name: require('./package').name
};
