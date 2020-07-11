const funnel = require('broccoli-funnel');
const merge = require('broccoli-merge-trees');
const manifest = require('broccoli-file-manifest');

const BroccoliNamespaceStyles = require('./namespace-styles.js');
const ScopeTemplates = require('./scope-templates.js');
const StyleInfo = require('./style-info.js');

class BaseStyles {
  constructor(options) {
    this.getCssExtentions = options.getCssExtentions;
    this.baseName = options.baseName;
    this.terseClassNames = options.terseClassNames;
  }

  get extentions() {
    if (!this._extentions) {
      this._extentions = this.getCssExtentions();
    }
    return this._extentions;
  }

  colocatedStyles(tree, srcDir = this.baseName, destDir = this.baseName) {
    const baseFiles = funnel(tree, {
      srcDir,
      destDir,
      allowEmpty: true,
      annotation: 'Funnel (ember-component-css grab files addon style files)',
    });

    return funnel(baseFiles, {
      include: [`**/*.{${this.extentions},}`],
      exclude: [`**/styles/**/*`],
      allowEmpty: true,
      annotation: 'Funnel (ember-component-css grab files addon style files)',
    });
  }
}

module.exports.MoveAddonColocatedStyles = class MoveAddonColocatedStyles extends BaseStyles {
  constructor(options) {
    super(options);
    this.addonRealDir = options.addonRealDir;
  }

  get name() {
    return 'move-addon-colocated-styles';
  }

  toTree(tree) {
    const colocatedStyles = this.colocatedStyles(this.addonRealDir, '');
    
    return merge([tree, colocatedStyles], { overwrite: true });
  }
}

const MANIFEST_TEMPATES = {
  default: '@import "<file-path>";',
  sass: '@import "<file-path>"',
  styl: '@import "<file-path>"',
  css: '@import "../../<file-path>";',
}

module.exports.ColocateStyles = class ColocateStyles extends BaseStyles {
  get name() {
    return 'colocate-styles';
  }

  generateManifest(tree, destDir) {
    const manifesto = manifest(tree, {
      outputFileNameWithoutExtension: 'ember-styles',
      templates: MANIFEST_TEMPATES,
      annotation: 'Manifest (ember-component-css style file manifest)',
    });

    return funnel(manifesto, {
      destDir,
    });
  }

  toTree(tree, destDir) {
    const colocatedStyles = this.colocatedStyles(tree);
    const manifests = this.generateManifest(colocatedStyles, destDir);
    
    return merge([tree, manifests], { overwrite: true });
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

  toTree(tree) {
    const colocatedStyles = this.colocatedStyles(tree);    
    const namespaced = this.namespaceStyles(colocatedStyles);

    return merge([tree, namespaced], { overwrite: true });
  }
}

module.exports.ColocatedNamespaceObjects = class ColocatedNamespaceObjects extends BaseStyles {
  get name() {
    return 'colocate-and-namespace-styles-in-js';
  }

  toTree(tree) {
    const colocatedStyles = this.colocatedStyles(tree);
    const generatedFiles = new StyleInfo(colocatedStyles, {
      terseClassNames: this.terseClassNames,
    });

    return merge([tree, generatedFiles], { overwrite: true });
  }
}

module.exports.ColocatedNamespaceTemplates = class ColocatedNamespaceTemplates extends BaseStyles {
  get name() {
    return 'colocate-and-namespace-styles-in-templates-only';
  }

  toTree(tree) {
    const scopedTemplates = new ScopeTemplates(tree, {
      terseClassNames: this.terseClassNames,
    });

    return merge([tree, scopedTemplates], { overwrite: true });
  }
}
