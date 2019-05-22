const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const StyleManifest = require('broccoli-style-manifest');
const Replace = require('broccoli-replace');
const NamespaceStyles = require('./namespace-styles.js');
const ScopeTemplates = require('./scope-templates.js');
const StyleInfo = require('./style-info.js');
// const esTranspiler = require('broccoli-babel-transpiler');
// const addStyleNamespace = require('./babel-add-style-namespace.js');
const SiblingFiles = require('./sibling-files.js');
const CreateSiblingFile = require('./create-sibling-file.js');

class ColocatedStyles {
  constructor(options) {
    this.baseNode = options.baseNode;
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
}

module.exports.ColocatedNamespacedStyles = class ColocatedNamespacedStyles extends ColocatedStyles {
  constructor(options) {
    super(options);

    this.name = 'colocate-and-namespace-styles';
    this.terseClassNames = options.terseClassNames;
    this.excludeFromManifest = options.excludeFromManifest;
    this.includeDeprecatedPodStylesFile = options.includeDeprecatedPodStylesFile;
  }

  generateManifest(node) {
    let styleManifest = new StyleManifest(node, {
      outputFileNameWithoutExtension: 'ember-styles',
      annotation: 'StyleManifest (ember-component-css app style file manifest)',
    });

    if (this.includeDeprecatedPodStylesFile) {
      let depricatedPodStyleFiles = new Funnel(styleManifest, {
        getDestinationPath: function(relativePath) {
          return relativePath.replace('ember-styles', 'pod-styles');
        }
      });

      styleManifest = new Merge([styleManifest, depricatedPodStyleFiles]);
    }

    // this is due to sass spcifically not allowing for ANY semicolons.
    return new Replace(styleManifest, {
      files: ['**/*.sass'],
      patterns: [{
        match: /;/g,
        replacement: '',
      }],
    });
  }

  namespaceStyles(node) {
    const withoutExcluded = new Funnel(node, {
      exclude: this.excludeFromManifest,
      annotation: 'Funnel (ember-component-css exclude style files from manifest)',
    });

    return new NamespaceStyles(withoutExcluded, {
      extensions: this.extentions,
      terseClassNames: this.terseClassNames,
      annotation: 'Filter (ember-component-css process :--component with class names)',
    });
  }

  namespacedStylesWithManifest(node, destDir) {
    const namespacedStylesWithManifest = new Merge([
      this.generateManifest(node),
      this.namespaceStyles(node),
    ]);

    return new Funnel(namespacedStylesWithManifest, {
      destDir,
    });
  }

  toTree(tree, inputPath) {
    let projectStyles = this.colocatedStylesFrom(this.baseNode);

    projectStyles = this.namespacedStylesWithManifest(projectStyles, inputPath);

    return new Merge([tree, projectStyles]);
  }
}

module.exports.ColocatedNamespaceObjects = class ColocatedNamespaceObjects extends ColocatedStyles {
  constructor(options) {
    super(options);

    this.templateOnly = options.templateOnly;
    this.name = 'colocate-and-namespace-styles-in-js';
  }

  toTree(tree, inputPath, outputPath) {
    let projectStyles = this.colocatedStylesFrom(this.baseNode);

    let generatedFiles = new StyleInfo(projectStyles);

    generatedFiles = new Funnel(generatedFiles, {
      destDir: outputPath,
    });

    tree = new Merge([tree, generatedFiles]);

    // let componentsToNamespace = new SiblingFiles(tree, {
    //   include: [`**/{component,styles}.js`],
    //   siblingsMatch: ['styles.js'],
    //   fileToInclude: 'component.js',
    // });
    //
    // let namespaceComponents = esTranspiler(componentsToNamespace, {
    //   plugins: [addStyleNamespace],
    // });


    if (!this.templateOnly) {
      let templateOnlys = new SiblingFiles(tree, {
        include: [`**/{component.js,styles.js,template.js}`],
        siblingsMatch: ['styles.js', 'template.js'],
        siblingsExclude: ['component.js'],
        fileToInclude: 'styles.js',
      });

      let addinBaseComponents = new CreateSiblingFile(templateOnlys);

      tree = new Merge([tree, addinBaseComponents], {
        overwrite: true
      });
    }

    return tree;
  }
}


module.exports.ColocatedNamespaceTemplates = class ColocatedNamespaceTemplates extends ColocatedStyles {
  constructor(options) {
    super(options);

    this.name = 'colocate-and-namespace-styles-in-templates-only';
    this.terseClassNames = options.terseClassNames;
  }

  get outputPath() {
    return this.registry.app.name || this.registry.app.modulePrefix;
  }

  toTree(tree, inputPath, outputPath) {
    console.log(outputPath, this.outputPath);
    let templateOnlys = new SiblingFiles(this.baseNode, {
      include: [`**/{component.js,styles.js,template.hbs}`],
      // siblingsMatch: ['styles.js'],
      siblingsExclude: ['component.js'],
      fileToInclude: 'template.hbs',
    });

    templateOnlys = new ScopeTemplates(templateOnlys, {
      terseClassNames: this.terseClassNames,
    });

    templateOnlys = new Funnel(templateOnlys, {
      destDir: this.outputPath,
    });

    return new Merge([tree, templateOnlys], {
      overwrite: true,
    });
  }
}
