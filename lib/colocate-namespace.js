const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const Manifest = require('broccoli-file-manifest');

const BroccoliNamespaceStyles = require('./namespace-styles.js');
const ScopeTemplates = require('./scope-templates.js');
const StyleInfo = require('./style-info.js');

class BaseStyles {
  constructor(options) {
    this.getExtentions = options.getExtentions;
    this.baseNode = options.baseNode;
    this.terseClassNames = options.terseClassNames;
    this.hasSrc = options.hasSrc;
  }

  get extentions() {
    if (!this._extentions) {
      this._extentions = this.getExtentions('css');
    }
    return this._extentions;
  }

  get colocatedStyles() {
    return new Funnel(this.baseNode, {
      include: [`**/*.{${this.extentions},}`],
      exclude: [`styles/**/*`, 'ui/styles/**/*'],
      allowEmpty: true,
      annotation: 'Funnel (ember-component-css grab files addon style files)',
    });
  }

  treeToLocation(destDir, tooToBePlaced, ...trees) {
    if (this.hasSrc) {
      destDir = destDir + '/src';
    }
    const placedTree = new Funnel(tooToBePlaced, { destDir });
    return new Merge(trees.concat(placedTree), { overwrite: true });
  }
}

const MANIFEST_TEMPATES = {
  default: '@import "<file-path>";',
  sass: '@import "<file-path>"',
  styl: '@import "<file-path>"',
}

module.exports.ColocateStyles = class ColocateStyles extends BaseStyles {
  get name() {
    return 'colocate-styles';
  }

  generateManifest(tree) {
    const manifest = Manifest(tree, {
      outputFileNameWithoutExtension: 'ember-styles',
      templates: MANIFEST_TEMPATES,
      annotation: 'Manifest (ember-component-css style file manifest)',
    });

    return new Merge([tree, manifest]);
  }

  toTree(tree, inputPath) {
    const projectStyles = this.generateManifest(this.colocatedStyles);

    return this.treeToLocation(inputPath, projectStyles, tree);
  }
}


module.exports.NamespaceStyles = class NamespaceStyles extends BaseStyles {
  get name() {
    return 'namespace-styles';
  }

  namespaceStyles(tree) {
    return new BroccoliNamespaceStyles(tree, {
      extensions: this.extentions,
      terseClassNames: this.terseClassNames,
      annotation: 'Filter (ember-component-css process root & or :--component with class name)',
    });
  }

  toTree(tree, inputPath) {
    const projectStyles = new Funnel(tree, {
      exclude: ['ember-styles.*', 'app.*', 'addon.*', '*.*'],
      srcDir: inputPath,
      allowEmpty: true,
    });
    const namespacedProjectStyles = this.namespaceStyles(projectStyles);

    return this.treeToLocation(inputPath, namespacedProjectStyles, tree);
  }
}

module.exports.ColocatedNamespaceObjects = class ColocatedNamespaceObjects extends BaseStyles {
  get name() {
    return 'colocate-and-namespace-styles-in-js';
  }

  toTree(tree, inputPath, outputPath) {
    const generatedFiles = new StyleInfo(this.colocatedStyles, {
      terseClassNames: this.terseClassNames,
    });

    return this.treeToLocation(outputPath, generatedFiles, tree);
  }
}

module.exports.ColocatedNamespaceTemplates = class ColocatedNamespaceTemplates extends BaseStyles {
  get name() {
    return 'colocate-and-namespace-styles-in-templates-only';
  }

  toTree(tree, inputPath, outputPath) {
    const scopedTemplates = new ScopeTemplates(tree, {
      terseClassNames: this.terseClassNames,
    });

    return this.treeToLocation(outputPath, scopedTemplates, tree);
  }
}
