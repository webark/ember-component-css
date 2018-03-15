'use strict';

const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const StyleManifest = require('broccoli-style-manifest');
const NamespaceStyles = require('./namespace-styles.js');
const StyleImports = require('./pod-names.js');

class ColocatedStyles {
  constructor(options) {
    this.isAddon = options.isAddon;
    this.registry = options.registry;
  }

  get extentions() {
    if (!this._extentions) {
      this._extentions = this.registry.extensionsForType('css');
    }

    return this._extentions;
  }

  colocatedStylesFrom(inputPath) {
    return new Funnel(inputPath, {
      include: [`**/*.{${this.extentions},}`],
      exclude: [`styles/**/*`],
      allowEmpty: true,
      annotation: 'Funnel (ember-component-css grab files addon style files)',
    });
  }

  projectStyleOptions(app) {
    const projectPath = this.isAddon ? [
      app.root,
      app.treePaths['addon'],
    ].join('/') : [
      app.project.root,
      (app.app || app).trees['app'],
    ].join('/');

    return new Funnel(projectPath);
  }
}

class ColocatedNamespacedStyles extends ColocatedStyles {
  constructor(options) {
    super(options);

    this.name = 'colocate-and-namespace-styles';
    this.terseClassNames = options.terseClassNames;
    this.excludeFromManifest = options.excludeFromManifest;
  }

  generateManifest(node) {
    return new StyleManifest(node, {
      outputFileNameWithoutExtension: 'ember-styles',
      annotation: 'StyleManifest (ember-component-css combining all style files that there are extensions for)'
    });
  }

  namespaceStyles(node) {
    const withoutExcluded = new Funnel(node, {
      exclude: this.excludeFromManifest,
      annotation: 'Funnel (ember-component-css exclude style files from manifest)'
    });

    return new NamespaceStyles(withoutExcluded, {
      extensions: this.extentions,
      terseClassNames: this.terseClassNames,
      annotation: 'Filter (ember-component-css process :--component with class names)'
    });
  }

  namespacedStylesWithManifest(node, destDir) {
    const namespacedStylesWithManifest = new Merge([
      this.generateManifest(node),
      this.namespaceStyles(node),
    ]);

    return new Funnel(namespacedStylesWithManifest, {
      destDir,
    })
  }

  toTree(tree, inputPath, outputPath, options) {
    let projectNode = this.projectStyleOptions(options.registry.app);
    let projectStyles = this.colocatedStylesFrom(projectNode);

    projectStyles = this.namespacedStylesWithManifest(projectStyles, inputPath);

    return new Merge([tree, projectStyles]);
  }
}

class ColocatedNamespaceObjects extends ColocatedStyles {
  constructor(options) {
    super(options);

    this.name = 'colocate-and-namespace-styles-in-js';
  }

  toTree(tree, inputPath, outputPath, options) {
    let projectNode = this.projectStyleOptions(options.registry.app);
    let projectStyles = this.colocatedStylesFrom(projectNode);

    let generatedFiles = new StyleImports(projectStyles);

    generatedFiles = new Funnel(generatedFiles, {
      destDir: outputPath
    });

    return new Merge([tree, generatedFiles]);
  }
}

module.exports.ColocatedNamespacedStyles = ColocatedNamespacedStyles;
module.exports.ColocatedNamespaceObjects = ColocatedNamespaceObjects;
