const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const StyleManifest = require('broccoli-style-manifest');
const BroccoliNamespaceStyles = require('./namespace-styles.js');
const ScopeTemplates = require('./scope-templates.js');
const StyleInfo = require('./style-info.js');

class BaseStyles {
  constructor(options) {
    this.getExtentions = options.getExtentions;
    this.baseNode = options.baseNode;
    this.terseClassNames = options.terseClassNames;
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
      exclude: [`styles/**/*`],
      allowEmpty: true,
      annotation: 'Funnel (ember-component-css grab files addon style files)',
    });
  }

  treeToLocation(destDir, tooToBePlaced, ...trees) {
    const placedTree = new Funnel(tooToBePlaced, { destDir });
    return new Merge(trees.concat(placedTree), { overwrite: true });
  }
}


module.exports.ColocateStyles = class ColocateStyles extends BaseStyles {
  get name() {
    return 'colocate-styles';
  }

  generateManifest(tree) {
    const manifest = new StyleManifest(tree, {
      outputFileNameWithoutExtension: 'ember-styles',
      annotation: 'StyleManifest (ember-component-css app style file manifest)',
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
      annotation: 'Filter (ember-component-css process :--component with class names)',
    });
  }

  toTree(tree, inputPath) {
    const projectStyles = new Funnel(tree, {
      exclude: ['ember-styles.*', 'app.*', 'addon.*'],
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
